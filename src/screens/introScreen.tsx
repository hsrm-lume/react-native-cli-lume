import React, {useState} from 'react';
import SlideView from '../components/intro/slide';
import Fire from '../assets/fire.svg';
import Torch from '../assets/torch.svg';
import Camera from '../assets/camera.svg';
import Map from '../assets/map.svg';
import {writeUserData} from '../services';
import {useNavigation} from '@react-navigation/native';
import QRCode from '../assets/qrCode.svg';

export default function IntroScreen() {
	//writeUserData({firstAppUse: false});
	const navigation = useNavigation();
	const slides = [
		{
			title: 'Hi!',
			image: Fire,
			explanation: 'lume is an app for sharing a digital Olympic Torch',
		},
		{
			title: 'the torch',
			image: Torch,
			explanation:
				'You always start here. With the torch view you can see if your torch is on or off and receive your torch',
		},
		{
			title: 'receiving a torch',
			image: Fire,
			explanation:
				'There are two ways of receiving a flame. Just hold 2 android phones together, and the sending phone will pass its torch to your phone.',
		},
		{
			title: 'using the camera',
			image: Camera,
			explanation:
				'Or use your camera. Press the camera button and use the pop-up window to scan a lume QR code, and your torch will be switched on in no time.',
		},
		{
			title: 'sharing your flame',
			image: QRCode,
			explanation:
				"Again, just hold two android phones together and you phone will share it's flame with the receipient",
		},
		{
			title: 'sharing your flame',
			image: QRCode,
			explanation: 'Press the QR code button to share a lume QR code.',
		},
		{
			title: 'Are you hungry for more?',
			image: Map,
			explanation:
				'View lume torch stats with the map view. How many times has it been passed on? Where has the torch gone\nHave fun exploring the map.',
		},
	];
	const getCurrentSlide = (num: number) => {
		return slides[num];
	};

	const [currentSlide, updateSlide] = useState(getCurrentSlide(0));
	const [currentSlideNum, updateSlideNum] = useState(0);
	const advance = () => {
		console.log(currentSlideNum);
		if (getCurrentSlide(currentSlideNum + 1) == undefined) {
			writeUserData({firstAppUse: false}).then(() => {
				console.log('writtenuserdata');
				// @ts-ignore: react navigation does not know how to use itself
				navigation.navigate('FireScreen');
			});
			return;
		}
		updateSlide(getCurrentSlide(currentSlideNum + 1));
		updateSlideNum(currentSlideNum + 1);
	};
	return (
		<>
			<SlideView advance={advance} data={currentSlide}></SlideView>
		</>
	);
}
