import React, {useState} from 'react';
import SlideView from '../components/intro/slide';
import Wave from '../assets/wave.svg';
import Torch from '../assets/torch.svg';
import ShareCamera from '../assets/shareCamera.svg';
import ShareQr from '../assets/shareQr.svg';
import ShareFlameFlipped from '../assets/shareFlameFlipped.svg';
import Map from '../assets/map.svg';
import ShareFlame from '../assets/shareFlame.svg';
import {writeUserData} from '../services';
import {useNavigation} from '@react-navigation/native';
import QRCode from '../assets/qrCode.svg';
import {Platform} from 'react-native';

export default function IntroScreen() {
	//writeUserData({firstAppUse: false});
	const navigation = useNavigation();
	var slides: any[] = [];
	const androidSlides = [
		{
			title: 'Hi!',
			image: Wave,
			explanation: 'lume is an App for sharing a digital Olympic Torch',
			noPrev: true,
		},
		{
			title: 'the torch',
			image: Torch,
			explanation:
				'You always start here. With the torch view you can light your torch see if your torch is lit and also receive your torch',
		},
		{
			title: 'receiving a torch',
			image: ShareFlame,
			explanation:
				'There are two ways of lighting your torch. Just hold 2 android phones together, and the sending phone will pass its torch to your phone.',
		},
		{
			title: 'using your camera',
			image: ShareCamera,
			explanation:
				'Or use your camera. Press the camera button and use the pop-up window to scan a lume QR code, and your torch will be lit in no time.',
		},
		{
			title: 'sharing your flame',
			image: ShareFlameFlipped,
			explanation:
				"Sharing is as simple as receiving a flame, just hold two android phones together and you phone will share it's flame with the receipient",
		},
		{
			title: 'sharing your flame',
			image: ShareQr,
			explanation:
				'Alternatively press the QR code button to share a lume QR code and scan it with a camera',
		},
		{
			title: 'Are you hungry for more?',
			image: Map,
			explanation:
				'View lume torch stats with the map view. How many times has it been passed on? Where has the torch gone\nHave fun exploring the map.',
		},
	];
	const iosSlides = [
		{
			title: 'Hi!',
			image: Wave,
			explanation: 'lume is an App for sharing a digital Olympic Torch',
			noPrev: true,
		},
		{
			title: 'the torch',
			image: Torch,
			explanation:
				'You always start here. With the torch view you can see if your torch is on or off and receive your torch',
		},
		{
			title: 'using the camera',
			image: ShareCamera,
			explanation:
				'Lighting your torch is easy. Press the camera button and use the pop-up window to scan a lume QR code, and your torch will be switched on in no time.',
		},
		{
			title: 'sharing your flame',
			image: ShareQr,
			explanation:
				'Sharing your torch is as simple as receiving it, just use the QR Code Button to bring up you lume code and share it with the world.',
		},
		{
			title: 'Are you hungry for more?',
			image: Map,
			explanation:
				'View lume torch stats with the map view. How many times has it been passed on? Where has the torch gone?\nHave fun exploring the map!',
		},
	];
	if (Platform.OS == 'ios') {
		slides = iosSlides;
	} else {
		slides = androidSlides;
	}
	const getCurrentSlide = (num: number) => {
		return slides[num];
	};

	const [currentSlide, updateSlide] = useState(getCurrentSlide(0));
	const [currentSlideNum, updateSlideNum] = useState(0);
	const advance = () => {
		if (getCurrentSlide(currentSlideNum + 1) == undefined) {
			writeUserData({firstAppUse: false}).then(() => {
				// @ts-ignore: react navigation does not know how to use itself
				navigation.navigate('FireScreen');
			});
			return;
		}
		updateSlide(getCurrentSlide(currentSlideNum + 1));
		updateSlideNum(currentSlideNum + 1);
	};

	const retreat = () => {
		if (getCurrentSlide(currentSlideNum - 1) == undefined) {
			return;
		}
		updateSlide(getCurrentSlide(currentSlideNum - 1));
		updateSlideNum(currentSlideNum - 1);
	};
	return (
		<>
			<SlideView
				advance={advance}
				retreat={retreat}
				data={currentSlide}></SlideView>
		</>
	);
}
