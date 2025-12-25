import { common } from '@mui/material/colors';
import shadow from './shadow';
import typography from './typography';

/**
 * LIGHT THEME (DEFAULT)
 */
export const light = {
	palette: {
		type: 'light',
		background: {
			default: '#f4f6f8',
			paper: common.white,
		},
		primary: {
			contrastText: '#ffffff',
			main: '#E92C28',
		},
		secondary: {
			main: '#1646C1',
		},
		text: {
			primary: '#212121',
			secondary: '#616161',
			dark: common.black,
		},
	},
	components: {
		MuiTypography: {
			styleOverrides: {
				root: {
					letterSpacing: '0',
				},
			},
			defaultProps: {
				variantMapping: {
					h1: 'h1',
					h2: 'h2',
					h3: 'h3',
					h4: 'h4',
					h5: 'h5',
					h6: 'h6',
					subtitle1: 'p',
					subtitle2: 'p',
					subtitle3: 'p',
					body1: 'p',
					body2: 'p',
				},
			},
		},
		MuiLink: {
			styleOverrides: {
				root: {
					color: '#757575',
					textDecoration: 'none',
				},
			},
		},
		MuiDivider: {
			styleOverrides: {
				root: {
					borderColor: '#eee',
				},
			},
		},
		MuiBox: {
			styleOverrides: {
				root: {
					padding: '0',
				},
			},
			makeStyles: {
				root: {
					padding: 0,
				},
			},
			sx: {
				'&.MuiBox-root': {
					component: 'div',
				},
			},
		},
		MuiContainer: {
			styleOverrides: {
				root: {
					maxWidth: 'inherit',
					padding: '0',
					'@media (min-width: 600px)': {
						paddingLeft: 0,
						paddingRight: 0,
					},
				},
			},
		},
		MuiCssBaseline: {
			styleOverrides: {
				html: { height: '100%' },
				body: { background: 'transparent', height: '100%', minHeight: '100%' },
				p: {
					margin: '0',
				},
			},
		},
		MuiAvatar: {
			styleOverrides: {
				root: {
					marginLeft: '0',
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					color: '#212121',
					minWidth: 'auto',
					lineHeight: '1.2',
					boxShadow: 'none',
					ButtonText: {
						color: '#212121',
					},
				},
			},
		},
		MuiIconButton: {
			styleOverrides: {
				root: {},
			},
		},
		MuiListItemButton: {
			styleOverrides: {
				root: {
					padding: '0',
				},
			},
		},
		MuiList: {
			styleOverrides: {
				root: {
					padding: '0',
				},
			},
		},
		MuiListItem: {
			styleOverrides: {
				root: {
					MuiSelect: {
						backgroundColor: '#fafafa',
					},
					padding: '0',
				},
			},
		},
		MuiFormControl: {
			styleOverrides: {
				root: {
					width: '100%',
				},
			},
		},
		MuiFormControlLabel: {
			styleOverrides: {
				root: {
					marginRight: '0',
				},
			},
		},
		MuiSelect: {
			styleOverrides: {
				root: {},
				select: {
					textAlign: 'left' as const,
				},
			},
		},
		MuiInputBase: {
			styleOverrides: {
				root: {
					input: {},
				},
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					height: '48px',
					width: '100%',
					backgroundColor: '#fff',
					input: {},
				},
				notchedOutline: {
					padding: '8px',
					top: '-9px',
					border: '1px solid #eee',
				},
			},
		},
		MuiFormHelperText: {
			styleOverrides: {
				root: {
					margin: '5px 0 0 2px',
					lineHeight: '1.2',
				},
			},
		},
		MuiStepper: {
			styleOverrides: {
				root: {
					alignItems: 'center',
				},
			},
		},
		MuiTabPanel: {
			styleOverrides: {
				root: {
					padding: '0',
				},
			},
		},
		MuiSvgIcon: {
			styleOverrides: {
				root: {},
			},
		},
		MuiStepIcon: {
			styleOverrides: {
				root: {
					color: '#fff',
					borderRadius: '50%',
					border: '1px solid #eee',
				},
				text: {
					fill: '#bdbdbd',
				},
			},
		},
		MuiStepConnector: {
			styleOverrides: {
				line: {
					borderColor: '#eee',
				},
			},
		},
		MuiStepLabel: {
			styleOverrides: {
				label: {
					fontSize: '14px',
				},
			},
		},
		MuiCheckbox: {
			styleOverrides: {
				root: {
					'&.Mui-checked': {
						color: 'black',
					},
				},
			},
		},
		MuiFab: {
			styleOverrides: {
				root: {
					width: '40px',
					height: '40px',
					background: '#fff',
					color: '#212121',
				},
				hover: {
					background: '#fff',
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					MuiMenu: {
						boxShadow: 'rgb(145 158 171 / 24%) 0px 0px 2px 0px, rgb(145 158 171 / 24%) -20px 20px 40px -4px',
					},
				},
			},
		},
		MuiMenuItem: {
			styleOverrides: {
				root: {
					padding: '6px 8px',
				},
			},
		},
		MuiAlert: {
			styleOverrides: {
				root: {
					boxShadow: 'none',
				},
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					border: '1px solid #ddd',
					color: '#212121',
				},
			},
		},
	},
	shadow,
	typography,
};

/**
 * DARK THEME
 */
export const dark = {
	palette: {
		type: 'dark',
		background: {
			default: '#0a0a0a',
			paper: '#1a1a1a',
		},
		primary: {
			contrastText: '#ffffff',
			main: '#f17742', // TurboCar orange - same in dark mode
		},
		secondary: {
			main: '#1646C1',
		},
		text: {
			primary: '#ffffff',
			secondary: '#e0e0e0',
			dark: '#ffffff',
		},
	},
	components: {
		MuiTypography: {
			styleOverrides: {
				root: {
					letterSpacing: '0',
				},
			},
			defaultProps: {
				variantMapping: {
					h1: 'h1',
					h2: 'h2',
					h3: 'h3',
					h4: 'h4',
					h5: 'h5',
					h6: 'h6',
					subtitle1: 'p',
					subtitle2: 'p',
					subtitle3: 'p',
					body1: 'p',
					body2: 'p',
				},
			},
		},
		MuiLink: {
			styleOverrides: {
				root: {
					color: '#e0e0e0',
					textDecoration: 'none',
				},
			},
		},
		MuiDivider: {
			styleOverrides: {
				root: {
					borderColor: '#3a3a3a',
				},
			},
		},
		MuiBox: {
			styleOverrides: {
				root: {
					padding: '0',
				},
			},
		},
		MuiContainer: {
			styleOverrides: {
				root: {
					maxWidth: 'inherit',
					padding: '0',
					'@media (min-width: 600px)': {
						paddingLeft: 0,
						paddingRight: 0,
					},
				},
			},
		},
		MuiCssBaseline: {
			styleOverrides: {
				html: { height: '100%' },
				body: { background: '#0a0a0a', height: '100%', minHeight: '100%' },
				p: {
					margin: '0',
				},
			},
		},
		MuiAvatar: {
			styleOverrides: {
				root: {
					marginLeft: '0',
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					color: '#ffffff',
					minWidth: 'auto',
					lineHeight: '1.2',
					boxShadow: 'none',
					ButtonText: {
						color: '#ffffff',
					},
				},
			},
		},
		MuiIconButton: {
			styleOverrides: {
				root: {},
			},
		},
		MuiListItemButton: {
			styleOverrides: {
				root: {
					padding: '0',
				},
			},
		},
		MuiList: {
			styleOverrides: {
				root: {
					padding: '0',
				},
			},
		},
		MuiListItem: {
			styleOverrides: {
				root: {
					MuiSelect: {
						backgroundColor: '#2a2a2a',
					},
					padding: '0',
				},
			},
		},
		MuiFormControl: {
			styleOverrides: {
				root: {
					width: '100%',
				},
			},
		},
		MuiFormControlLabel: {
			styleOverrides: {
				root: {
					marginRight: '0',
				},
			},
		},
		MuiSelect: {
			styleOverrides: {
				root: {},
				select: {
					textAlign: 'left' as const,
				},
			},
		},
		MuiInputBase: {
			styleOverrides: {
				root: {
					input: {},
				},
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					height: '48px',
					width: '100%',
					backgroundColor: '#2a2a2a',
					input: {
						color: '#ffffff',
					},
				},
				notchedOutline: {
					padding: '8px',
					top: '-9px',
					border: '1px solid #3a3a3a',
				},
			},
		},
		MuiFormHelperText: {
			styleOverrides: {
				root: {
					margin: '5px 0 0 2px',
					lineHeight: '1.2',
					color: '#a0a0a0',
				},
			},
		},
		MuiStepper: {
			styleOverrides: {
				root: {
					alignItems: 'center',
				},
			},
		},
		MuiTabPanel: {
			styleOverrides: {
				root: {
					padding: '0',
				},
			},
		},
		MuiSvgIcon: {
			styleOverrides: {
				root: {},
			},
		},
		MuiStepIcon: {
			styleOverrides: {
				root: {
					color: '#2a2a2a',
					borderRadius: '50%',
					border: '1px solid #3a3a3a',
				},
				text: {
					fill: '#a0a0a0',
				},
			},
		},
		MuiStepConnector: {
			styleOverrides: {
				line: {
					borderColor: '#3a3a3a',
				},
			},
		},
		MuiStepLabel: {
			styleOverrides: {
				label: {
					fontSize: '14px',
					color: '#e0e0e0',
				},
			},
		},
		MuiCheckbox: {
			styleOverrides: {
				root: {
					'&.Mui-checked': {
						color: '#f17742',
					},
				},
			},
		},
		MuiFab: {
			styleOverrides: {
				root: {
					width: '40px',
					height: '40px',
					background: '#2a2a2a',
					color: '#ffffff',
				},
				hover: {
					background: '#3a3a3a',
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					backgroundColor: '#1a1a1a',
					MuiMenu: {
						boxShadow: 'rgb(0 0 0 / 40%) 0px 0px 2px 0px, rgb(0 0 0 / 40%) -20px 20px 40px -4px',
					},
				},
			},
		},
		MuiMenuItem: {
			styleOverrides: {
				root: {
					padding: '6px 8px',
					color: '#e0e0e0',
					'&:hover': {
						backgroundColor: '#2a2a2a',
					},
				},
			},
		},
		MuiAlert: {
			styleOverrides: {
				root: {
					boxShadow: 'none',
				},
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					border: '1px solid #3a3a3a',
					color: '#e0e0e0',
					backgroundColor: '#2a2a2a',
				},
			},
		},
	},
	shadow,
	typography,
};
