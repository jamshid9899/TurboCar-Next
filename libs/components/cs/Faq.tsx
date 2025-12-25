import React, { SyntheticEvent, useState } from 'react';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import { AccordionDetails, Box, Stack, Typography } from '@mui/material';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
	({ theme }) => ({
		border: `1px solid ${theme.palette.divider}`,
		'&:not(:last-child)': {
			borderBottom: 0,
		},
		'&:before': {
			display: 'none',
		},
	}),
);
const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: '1.4rem' }} />} {...props} />
))(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : '#fff',
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
		transform: 'rotate(180deg)',
	},
	'& .MuiAccordionSummary-content': {
		marginLeft: theme.spacing(1),
	},
}));

const Faq = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [category, setCategory] = useState<string>('property');
	const [expanded, setExpanded] = useState<string | false>('panel1');

	/** APOLLO REQUESTS **/
	/** LIFECYCLES **/
	
	/** HANDLERS **/
	const changeCategoryHandler = (category: string) => {
		setCategory(category);
	};

	const handleChange = (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
		setExpanded(newExpanded ? panel : false);
	};

	const data: any = {
		property: [
			{
				id: '00f5a45ed8897f8090116a01',
				subject: 'Are the cars displayed on the site reliable?',
				content: 'Of course! We only have verified cars from trusted dealers and private sellers.',
			},
			{
				id: '00f5a45ed8897f8090116a22',
				subject: 'What types of cars do you offer?',
				content: 'We offer sedans, SUVs, coupes, hatchbacks, convertibles, vans, trucks, electric vehicles, and more.',
			},
			{
				id: '00f5a45ed8897f8090116a21',
				subject: 'How can I search for cars on your website?',
				content: 'Simply use our search bar to enter location, price range, car brand, car type, and other filters.',
			},
			{
				id: '00f5a45ed8897f8090116a23',
				subject: 'Do you provide assistance for first-time car buyers?',
				content: 'Yes, we guide you through the process and help find suitable financing options.',
			},
			{
				id: '00f5a45ed8897f8090116a24',
				subject: 'What should I consider when buying a car?',
				content: 'Consider factors such as brand, model, year, mileage, condition, fuel type, and price.',
			},
			{
				id: '00f5a45ed8897f8090116a25',
				subject: 'How long does the car-buying process typically take?',
				content: 'Usually 1 to 3 days, depending on payment method and documentation.',
			},
			{
				id: '00f5a45ed8897f8090116a29',
				subject: 'What happens if I encounter issues with the car after purchase?',
				content: 'We offer post-purchase support and can connect you with the seller or dealer to address any concerns.',
			},
			{
				id: '00f5a45ed8897f8090116a28',
				subject: 'Do you offer cars in specific locations?',
				content: 'Yes, we have listings in various cities across Spain including Madrid, Barcelona, Valencia, and more.',
			},
			{
				id: '00f5a45ed8897f8090116a27',
				subject: 'Can I sell my car through your website?',
				content: 'Absolutely! You can list your car for free and reach thousands of potential buyers.',
			},
			{
				id: '00f5a45ed8897f8090116b99',
				subject: 'What if I need help understanding legal aspects of car purchase?',
				content: 'Our team can provide basic guidance and recommend legal professionals if needed.',
			},
		],
		payment: [
			{
				id: '00f5a45ed8897f8090116a02',
				subject: 'How can I make the payment?',
				content: 'You can make the payment directly to the seller or dealer. We recommend using secure payment methods and meeting in person for cash transactions.',
			},
			{
				id: '00f5a45ed8897f8090116a91',
				subject: 'Are there any additional fees for using your services?',
				content: 'No, our services are free for buyers. Sellers can list their cars for free.',
			},
			{
				id: '00f5a45ed8897f8090116a92',
				subject: 'Is there an option for installment payments?',
				content: 'Yes, many dealers offer financing options. You can discuss payment plans directly with the seller or dealer.',
			},
			{
				id: '00f5a45ed8897f8090116a93',
				subject: 'Is my payment information secure?',
				content:
					'We recommend using secure payment methods. For cash transactions, always meet in person in a safe location.',
			},
			{
				id: '00f5a45ed8897f8090116a94',
				subject: 'Can I make payments online through your website?',
				content: "Currently, payments are handled directly between buyer and seller. We're working on secure online payment options.",
			},
			{
				id: '00f5a45ed8897f8090116a95',
				subject: "What happens if there's an issue with my payment?",
				content: 'If you encounter any issues with your payment, please contact our support team immediately for assistance.',
			},
			{
				id: '00f5a45ed8897f8090116a96',
				subject: 'Do you offer refunds for payments made?',
				content:
					'Refund policies depend on the agreement between buyer and seller. Please refer to your purchase agreement or contact us for assistance.',
			},
			{
				id: '00f5a45ed8897f8090116a97',
				subject: 'Are there any discounts or special offers?',
				content:
					'We occasionally offer promotions and discounts. Check our notices section or contact dealers directly for current offers.',
			},
			{
				id: '00f5a45ed8897f8090116a99',
				subject: 'How long does it take for payments to be processed?',
				content:
					'Payment processing depends on the method used. Bank transfers typically take 1-3 business days, while cash transactions are immediate.',
			},
			{
				id: '00f5a45ed8897f8090116a98',
				subject: 'Are there penalties for late payments?',
				content:
					'Payment terms are agreed upon between buyer and seller. Please refer to your purchase agreement for specific terms.',
			},
		],
		buyers: [
			{
				id: '00f5a45ed8897f8090116a03',
				subject: 'What should buyers pay attention to?',
				content: 'Buyers should check the car condition, mileage, service history, and verify all documents before purchasing or renting!',
			},
			{
				id: '00f5a45ed8897f8090116a85',
				subject: 'How can I determine if a car is within my budget?',
				content:
					'Calculate your budget by considering the car price, insurance, registration, and maintenance costs. Use our price filters to find cars within your budget.',
			},
			{
				id: '00f5a45ed8897f8090116a84',
				subject: 'What documents do I need when purchasing a car?',
				content:
					"You'll typically need identification, proof of address, and payment method. For financing, you may need proof of income and bank statements.",
			},
			{
				id: '00f5a45ed8897f8090116a83',
				subject: 'What factors should I consider when choosing a car?',
				content:
					'Consider factors such as brand, model, year, mileage, condition, fuel type, transmission, color, and your specific needs.',
			},
			{
				id: '00f5a45ed8897f8090116a82',
				subject: 'Can I negotiate the price of a car?',
				content:
					'Yes, you can negotiate the price with the seller or dealer. Many sellers are open to reasonable offers.',
			},
			{
				id: '00f5a45ed8897f8090116a81',
				subject: 'What are some red flags to watch out for when viewing cars?',
				content:
					'Watch out for signs of accidents, rust, unusual sounds, mismatched paint, incomplete service history, and suspiciously low prices.',
			},
			{
				id: '00f5a45ed8897f8090116a80',
				subject: 'Do you provide assistance with car inspections?',
				content:
					'Yes, we recommend getting a professional inspection before purchase. You can arrange inspections with trusted mechanics.',
			},
			{
				id: '00f5a45ed8897f8090116a79',
				subject: 'How long does it typically take to find the right car?',
				content:
					'The timeframe varies depending on your preferences and availability. Use our filters to narrow down your search and find the perfect car faster.',
			},
			{
				id: '00f5a45ed8897f8090116a78',
				subject: 'What are the advantages of buying from verified dealers?',
				content:
					'Verified dealers provide warranty options, financing, professional service, and peace of mind with verified listings.',
			},
			{
				id: '00f5a45ed8897f8090116a77',
				subject: 'What happens if I change my mind about a car after making an offer?',
				content:
					'Depending on the agreement with the seller, you may be able to withdraw your offer. Always clarify terms before committing.',
			},
		],

		agents: [
			{
				id: '00f5a45ed8897f8090116a04',
				subject: 'What do I need to do if I want to become a dealer?',
				content:
					'If you want to become a verified dealer, you should read our terms and conditions and contact the admin!',
			},
			{
				id: '00f5a45ed8897f8090116a62',
				subject: 'What qualifications do I need to become a car dealer?',
				content: 'You need a valid business license, proper documentation, and meet our verification requirements.',
			},
			{
				id: '00f5a45ed8897f8090116a63',
				subject: 'How do I find customers as a new dealer?',
				content: 'List your cars on TurboCar, use our marketing tools, build your reputation with verified listings.',
			},
			{
				id: '00f5a45ed8897f8090116a64',
				subject: 'What are some effective marketing strategies for selling cars?',
				content: 'Use high-quality photos, detailed descriptions, competitive pricing, and respond quickly to inquiries.',
			},
			{
				id: '00f5a45ed8897f8090116a65',
				subject: 'How do I handle negotiations with buyers?',
				content: 'Be transparent about car condition, provide accurate information, and maintain professional communication.',
			},
			{
				id: '00f5a45ed8897f8090116a66',
				subject: 'What should I do to stay updated with market trends?',
				content: 'Monitor car prices, follow automotive news, understand buyer preferences, and adjust your inventory accordingly.',
			},
			{
				id: '00f5a45ed8897f8090116a67',
				subject: 'How do I handle difficult customers or situations?',
				content:
					'Approach with professionalism, empathy, and patience. Listen actively, address concerns, and provide solutions.',
			},
			{
				id: '00f5a45ed8897f8090116a68',
				subject: 'What tools and features are available for dealers?',
				content: 'Use our listing management, analytics dashboard, customer inquiries system, and verification badges.',
			},
			{
				id: '00f5a45ed8897f8090116a69',
				subject: 'How do I ensure compliance with automotive laws and regulations?',
				content: 'Stay updated with regulations, maintain proper documentation, ensure all cars meet legal requirements.',
			},
			{
				id: '00f5a45ed8897f8090116a70',
				subject: 'What strategies can I use to grow my dealership business?',
				content: 'Build trust with verified listings, provide excellent customer service, offer competitive prices, and maintain quality inventory.',
			},
		],
		membership: [
			{
				id: '00f5a45ed8897f8090116a05',
				subject: 'Do you have a membership service on your site?',
				content: 'membership service is not available on our site yet!',
			},
			{
				id: '00f5a45ed8897f8090116a60',
				subject: 'What are the benefits of becoming a member on your website?',
				content: 'We currently do not offer membership benefits, but stay tuned for updates on any future offerings.',
			},
			{
				id: '00f5a45ed8897f8090116a59',
				subject: 'Is there a fee associated with becoming a member?',
				content: 'As membership services are not available, there are no associated fees at this time.',
			},
			{
				id: '00f5a45ed8897f8090116a58',
				subject: 'Will membership provide access to exclusive content or features?',
				content: "We don't currently have membership-exclusive content or features.",
			},
			{
				id: '00f5a45ed8897f8090116a57',
				subject: 'How can I sign up for a membership on your site?',
				content: 'As of now, we do not have a sign-up process for memberships.',
			},
			{
				id: '00f5a45ed8897f8090116a56',
				subject: 'Do members receive discounts on property listings or services?',
				content: 'Membership discounts are not part of our current offerings.',
			},
			{
				id: '00f5a45ed8897f8090116a55',
				subject: 'Are there plans to introduce a membership program in the future?',
				content:
					"While we can't confirm any plans at this time, we're always exploring ways to enhance our services for users.",
			},
			{
				id: '00f5a45ed8897f8090116a54',
				subject: 'What kind of content or benefits can members expect if a membership program is introduced?',
				content: "We're evaluating potential benefits and features, but specifics are not available yet.",
			},
			{
				id: '00f5a45ed8897f8090116a33',
				subject: 'Do you offer a premium membership option on your platform?',
				content: 'Currently, we do not provide a premium membership option.',
			},
			{
				id: '00f5a45ed8897f8090116a32',
				subject: 'Will membership grant access to exclusive deals or discounts?',
				content: 'Membership perks, including deals or discounts, are not available at this time.',
			},
		],
		community: [
			{
				id: '00f5a45ed8897f8090116a06',
				subject: 'What should I do if there is abusive or criminal behavior in the community section?',
				content: 'If you encounter this situation, please report it immediately or contact the admin!',
			},
			{
				id: '00f5a45ed8897f8090116a44',
				subject: 'How can I participate in the community section of your website?',
				content: 'Create an account and engage in discussions.',
			},
			{
				id: '00f5a45ed8897f8090116a45',
				subject: 'Are there guidelines for posting?',
				content: 'Yes, follow our community guidelines.',
			},
			{
				id: '00f5a45ed8897f8090116a46',
				subject: 'What should I do if I encounter spam or irrelevant posts?',
				content: 'Report them to the admin.',
			},
			{
				id: '00f5a45ed8897f8090116a47',
				subject: 'Can I connect with other members outside of the community section?',
				content: 'Currently, no.',
			},
			{
				id: '00f5a45ed8897f8090116a48',
				subject: 'Can I share personal experiences or recommendations?',
				content: 'Yes, if relevant you can share personal experiences and recommendations.',
			},
			{
				id: '00f5a45ed8897f8090116a49',
				subject: 'How can I ensure privacy?',
				content: 'Avoid sharing sensitive information.',
			},
			{
				id: '00f5a45ed8897f8090116a50',
				subject: 'How can I contribute positively?',
				content: 'Respect others and engage constructively.',
			},
			{
				id: '00f5a45ed8897f8090116a51',
				subject: 'What if I notice misinformation?',
				content: 'Provide correct information or report to the admin.',
			},
			{
				id: '00f5a45ed8897f8090116a52',
				subject: 'Are there moderators?',
				content: 'Yes, we have moderators.',
			},
		],
		other: [
			{
				id: '00f5a45ed8897f8090116a40',
				subject: 'Who should I contact if I want to buy your site?',
				content: 'We have no plans to sell the site at this time!',
			},
			{
				id: '00f5a45ed8897f8090116a39',
				subject: 'Can I advertise my services on your website?',
				content: 'We currently do not offer advertising opportunities on our site.',
			},
			{
				id: '00f5a45ed8897f8090116a38',
				subject: 'Are there sponsorship opportunities available on your platform?',
				content: 'At this time, we do not have sponsorship opportunities.',
			},
			{
				id: '00f5a45ed8897f8090116a36',
				subject: 'Can I contribute guest posts or articles to your website?',
				content: "We're not accepting guest posts or articles at the moment.",
			},
			{
				id: '00f5a45ed8897f8090116a35',
				subject: 'Is there a referral program for recommending your website to others?',
				content: "We don't have a referral program in place currently.",
			},
			{
				id: '00f5a45ed8897f8090116a34',
				subject: 'Do you offer affiliate partnerships for promoting your services?',
				content: 'Affiliate partnerships are not available at this time.',
			},
			{
				id: '00f5a45ed8897f8090116a33',
				subject: 'Can I purchase merchandise related to your website?',
				content: "We don't have merchandise available for purchase.",
			},
			{
				id: '00f5a45ed8897f8090116a32',
				subject: 'Are there any job openings or opportunities to work with your team?',
				content: 'Currently, we do not have any job openings or opportunities available.',
			},
			{
				id: '00f5a45ed8897f8090116a31',
				subject: 'Do you host events or webinars related to real estate?',
				content: "We're not hosting events or webinars at this time.",
			},
			{
				id: '00f5a45ed8897f8090116a30',
				subject: 'Can I request custom features or functionalities for your website?',
				content: "We're not accepting requests for custom features or functionalities.",
			},
		],
	};

	if (device === 'mobile') {
		return <div>FAQ MOBILE</div>;
	} else {
		return (
			<Stack className={'faq-content'}>
				<Box className={'categories'} component={'div'}>
					<div
						className={category === 'property' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('property');
						}}
					>
						Cars
					</div>
					<div
						className={category === 'payment' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('payment');
						}}
					>
						Payment
					</div>
					<div
						className={category === 'buyers' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('buyers');
						}}
					>
						For Buyers
					</div>
					<div
						className={category === 'agents' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('agents');
						}}
					>
						For Dealers
					</div>
					<div
						className={category === 'membership' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('membership');
						}}
					>
						Membership
					</div>
					<div
						className={category === 'community' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('community');
						}}
					>
						Community
					</div>
					<div
						className={category === 'other' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('other');
						}}
					>
						Other
					</div>
				</Box>
				<Box className={'wrap'} component={'div'}>
					{data[category] &&
						data[category].map((ele: any) => (
							<Accordion expanded={expanded === ele?.id} onChange={handleChange(ele?.id)} key={ele?.subject}>
								<AccordionSummary id="panel1d-header" className="question" aria-controls="panel1d-content">
									<Typography className="badge" variant={'h4'}>
										Q
									</Typography>
									<Typography> {ele?.subject}</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Stack className={'answer flex-box'}>
										<Typography className="badge" variant={'h4'} color={'primary'}>
											A
										</Typography>
										<Typography> {ele?.content}</Typography>
									</Stack>
								</AccordionDetails>
							</Accordion>
						))}
				</Box>
			</Stack>
		);
	}
};

export default Faq;
