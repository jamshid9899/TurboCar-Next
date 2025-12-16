import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Stack, Box } from '@mui/material';
import moment from 'moment';

const Footer = () => {
	const device = useDeviceDetect();

	if (device == 'mobile') {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<Box component={'div'} className={'footer-box'}>
							<img src="/img/logo/turbocar-logo-white.svg" alt="TurboCar" className={'logo'} />
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>24/7 Customer Support</span>
							<p>+34 900 123 456</p>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>Need Help?</span>
							<p>support@turbocar.es</p>
							<span>Live Chat Available</span>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<p>Follow us on social media</p>
							<div className={'media-box'}>
								<FacebookOutlinedIcon />
								<TelegramIcon />
								<InstagramIcon />
								<TwitterIcon />
							</div>
						</Box>
					</Stack>
					<Stack className={'right'}>
						<Box component={'div'} className={'bottom'}>
							<div>
								<strong>Popular Searches</strong>
								<span>Cars for Sale</span>
								<span>Cars for Rent</span>
								<span>Luxury Cars</span>
							</div>
							<div>
								<strong>Quick Links</strong>
								<span>Terms of Use</span>
								<span>Privacy Policy</span>
								<span>Pricing Plans</span>
								<span>Contact Support</span>
								<span>FAQs</span>
							</div>
							<div>
								<strong>Top Cities</strong>
								<span>Madrid</span>
								<span>Barcelona</span>
								<span>Valencia</span>
								<span>Sevilla</span>
							</div>
						</Box>
					</Stack>
				</Stack>
				<Stack className={'second'}>
					<span>© TurboCar - All rights reserved. {moment().year()}</span>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<Box component={'div'} className={'footer-box'}>
							<img src="/img/logo/turbocar-logo-white.svg" alt="TurboCar" className={'logo'} />
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>24/7 Customer Support</span>
							<p>+34 900 123 456</p>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>Need Help?</span>
							<p>support@turbocar.es</p>
							<span>Live Chat Available</span>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<p>Follow us on social media</p>
							<div className={'media-box'}>
								<FacebookOutlinedIcon />
								<TelegramIcon />
								<InstagramIcon />
								<TwitterIcon />
							</div>
						</Box>
					</Stack>
					<Stack className={'right'}>
						<Box component={'div'} className={'top'}>
							<strong>Stay Updated</strong>
							<div>
								<input type="text" placeholder={'Your Email'} />
								<span>Subscribe</span>
							</div>
						</Box>
						<Box component={'div'} className={'bottom'}>
							<div>
								<strong>Popular Searches</strong>
								<span>Cars for Sale</span>
								<span>Cars for Rent</span>
								<span>Luxury Cars</span>
								<span>Electric Cars</span>
							</div>
							<div>
								<strong>Quick Links</strong>
								<span>Terms of Use</span>
								<span>Privacy Policy</span>
								<span>Pricing Plans</span>
								<span>Our Services</span>
								<span>Contact Support</span>
								<span>FAQs</span>
							</div>
							<div>
								<strong>Top Cities</strong>
								<span>Madrid</span>
								<span>Barcelona</span>
								<span>Valencia</span>
								<span>Sevilla</span>
								<span>Málaga</span>
								<span>Bilbao</span>
							</div>
						</Box>
					</Stack>
				</Stack>
				<Stack className={'second'}>
					<span>© TurboCar - All rights reserved. {moment().year()}</span>
					<span>Privacy · Terms · Sitemap</span>
				</Stack>
			</Stack>
		);
	}
};

export default Footer;