import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, Text, Platform} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {
	useScanBarcodes,
	BarcodeFormat,
	Barcode,
} from 'vision-camera-code-scanner';
import {RestClient, writeUserData} from '../../services';
import {GeoLocation, HandledPromise} from '../../types';
import {QrCodeData} from '../../types/TranmissionData';
import ThinCross from '../../assets/thinCross.svg';
import Loading from '../../assets/loading.svg';
import {Icon} from '../icon';

/**
 * @param uid uuid of current user
 * @param position position of current user
 * @param updateQrStatus callback to close QRScanner
 */
const QRScanner = (props: {
	uid: string;
	position: GeoLocation;
	updateQrStatus: () => void;
}) => {
	// current detected QR-Code
	const [qrCode, setQrCode] = useState<Barcode | undefined>(undefined);

	const [cameraPermissionStatus, setCameraPermissionStatus] = useState(false);

	// get permission
	useEffect(() => {
		(async () => {
			const status = await Camera.requestCameraPermission();
			setCameraPermissionStatus(status === 'authorized');
		})();
	}, []);

	// get camera device of mobile phone
	const devices = useCameraDevices('wide-angle-camera');
	const device = devices.back;

	// scan camera frames for QR-Codes
	const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE]);

	// check barcodes for correct QR-Codes
	useEffect(() => {
		// check if barcodes array is empty
		if (Array.isArray(barcodes) && barcodes.length) {
			const barcode = barcodes[0];

			if (
				// check if QR-Code has data
				barcode !== undefined &&
				barcode.displayValue !== undefined &&
				barcode.displayValue !== ''
			)
				if (
					// check if QR-Code is new
					qrCode === undefined ||
					qrCode.displayValue === '' ||
					barcode.displayValue !== qrCode.displayValue
				)
					// set QR-Code as current detected QR-Code
					setQrCode(barcode);
		}
	}, [barcodes, qrCode]);

	// process new current detected QR-Code
	useEffect(() => {
		if (qrCode !== undefined && qrCode.displayValue !== undefined) {
			const data = qrCode.displayValue;
			new HandledPromise<[QrCodeData, QrCodeData]>('qr.invalid', resolve => {
				// validation of parameters
				if (!props.uid) throw new Error('Torch not yet ready');
				if (!props.position) throw new Error('Position not accurate enough');
				if (!data) throw new Error('QR-Code is empty');
				let self: QrCodeData;
				let received: QrCodeData;
				try {
					self = {
						ts: Math.floor(Date.now() / 1000),
						uuid: props.uid,
						location: props.position,
					};
					// try parsing data string into QrCodeData object
					received = JSON.parse(data);
				} catch (error) {
					throw new Error('QR-Code is invalid');
				}
				// check timestamp
				if (self.ts - received.ts > 10) throw new Error('QR-Code is outdated');
				resolve([self, received]);
			})
				.then(([self, received]) =>
					// POST ApiData to REST API
					RestClient.postContact(received.uuid, self.uuid, self.location)
				)
				.then(() =>
					// fireStatus -> realm
					writeUserData({fireStatus: true})
				)
				.then(() =>
					// close QRScanner
					props.updateQrStatus()
				);
		}
	}, [qrCode, props]);

	// following block is a fix for https://github.com/mrousavy/react-native-vision-camera/issues/626
	const mounted = useRef(false); // track here if component is (still) mounted
	useEffect(() => {
		mounted.current = true;
		return () => {
			mounted.current = false;
		};
	}, []);
	const [didDryLoad, setDidDryLoad] = useState(0); // pattern to delay the loading of the camera to avoid race conditions
	const getFrameProcessor = () => {
		if (Platform.OS === 'ios') return frameProcessor; // dont do the scuffed fix on ios
		if (didDryLoad === 0) {
			setDidDryLoad(1);
			setTimeout(() => {
				if (mounted.current) setDidDryLoad(2);
			}, 200);
		} else if (didDryLoad === 2) return frameProcessor; // return the frame processor delayed
		return undefined;
	};

	return (
		<>
			<View style={styles.headlineBox}>
				<Text style={styles.headlineText}>ILLUMINATE YOUR FIRE!</Text>
			</View>
			<View style={styles.window}>
				{device !== undefined && device !== null && cameraPermissionStatus ? (
					// render QR-Code Scanner if camera is ready and permission is granted
					<>
						<Icon
							icon={ThinCross}
							action={props.updateQrStatus}
							style={styles.closeWindow}
						/>
						<View style={styles.cameraView}>
							<Camera
								style={styles.camera}
								device={device}
								isActive={true}
								frameProcessor={getFrameProcessor()}
								frameProcessorFps={1}
							/>
						</View>
						<View style={styles.textBox}>
							<Text style={styles.text}>Scan a lume QR-Code!</Text>
						</View>
					</>
				) : (
					// render loading screen if camera is not ready or permission is not granted
					<>
						<View style={styles.loadingContainer}>
							<Icon icon={Loading} style={styles.loadingIcon} />
						</View>
						<View style={styles.textBox}>
							<Text style={styles.text}>
								Please be patient while the camera loads.
							</Text>
						</View>
					</>
				)}
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	headlineBox: {
		alignItems: 'center',
		paddingTop: 64,
	},
	headlineText: {
		fontFamily: 'Domus-Tilting',
		fontSize: 30,
		color: '#000000',
	},
	window: {
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
		borderRadius: 30,
		height: 445,
		width: 331,
		marginTop: 35,
	},
	cameraView: {
		borderRadius: 20,
		overflow: 'hidden',
	},
	camera: {
		height: 320,
		width: 280,
		alignSelf: 'center',
	},
	textBox: {
		alignItems: 'center',
		marginTop: 20,
	},
	text: {
		fontFamily: 'Nexusa-Next',
		fontSize: 22,
		color: '#000000',
	},
	closeWindow: {
		alignSelf: 'flex-end',
		width: '13%',
		height: '13%',
		paddingRight: '5%',
	},
	loadingContainer: {
		height: 300,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	loadingIcon: {
		height: '80%',
		width: '80%',
	},
});

export default QRScanner;
