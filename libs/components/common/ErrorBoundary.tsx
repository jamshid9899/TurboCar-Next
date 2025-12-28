import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useRouter } from 'next/router';

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
	errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
			errorInfo: null,
		};
	}

	static getDerivedStateFromError(error: Error): State {
		return {
			hasError: true,
			error,
			errorInfo: null,
		};
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('ErrorBoundary caught an error:', error, errorInfo);
		this.setState({
			error,
			errorInfo,
		});

		// Log to error reporting service (e.g., Sentry)
		// if (typeof window !== 'undefined' && window.Sentry) {
		//   window.Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
		// }
	}

	handleReset = () => {
		this.setState({
			hasError: false,
			error: null,
			errorInfo: null,
		});
	};

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return <ErrorFallback error={this.state.error} onReset={this.handleReset} />;
		}

		return this.props.children;
	}
}

interface ErrorFallbackProps {
	error: Error | null;
	onReset: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, onReset }) => {
	const router = useRouter();

	const handleGoHome = () => {
		router.push('/');
	};

	const handleReload = () => {
		window.location.reload();
	};

	return (
		<Box
			sx={{
				width: '100%',
				minHeight: '60vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				padding: 4,
			}}
		>
			<Stack
				spacing={3}
				alignItems="center"
				sx={{
					maxWidth: 600,
					textAlign: 'center',
				}}
			>
				{/* Error Icon */}
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						width: 120,
						height: 120,
						borderRadius: '50%',
						backgroundColor: '#fee',
					}}
				>
					<ErrorOutlineIcon sx={{ fontSize: 60, color: '#d32f2f' }} />
				</Box>

				{/* Error Title */}
				<Typography
					variant="h4"
					sx={{
						fontWeight: 700,
						color: '#181a20',
						fontFamily: 'inherit',
					}}
				>
					Something went wrong
				</Typography>

				{/* Error Message */}
				<Typography
					variant="body1"
					sx={{
						color: '#717171',
						fontFamily: 'inherit',
						lineHeight: 1.6,
					}}
				>
					We're sorry, but something unexpected happened. Please try again or contact support if the problem persists.
				</Typography>

				{/* Error Details (Development Only) */}
				{process.env.NODE_ENV === 'development' && error && (
					<Box
						sx={{
							width: '100%',
							padding: 2,
							backgroundColor: '#f5f5f5',
							borderRadius: '8px',
							textAlign: 'left',
						}}
					>
						<Typography
							variant="caption"
							sx={{
								fontFamily: 'monospace',
								color: '#d32f2f',
								wordBreak: 'break-word',
							}}
						>
							{error.toString()}
						</Typography>
					</Box>
				)}

				{/* Action Buttons */}
				<Stack direction="row" spacing={2} sx={{ mt: 2 }}>
					<Button
						variant="contained"
						onClick={onReset}
						sx={{
							backgroundColor: '#f17742',
							color: '#ffffff',
							padding: '12px 32px',
							borderRadius: '8px',
							fontWeight: 600,
							textTransform: 'none',
							'&:hover': {
								backgroundColor: '#e0662e',
							},
						}}
					>
						Try Again
					</Button>
					<Button
						variant="outlined"
						onClick={handleGoHome}
						sx={{
							borderColor: '#f17742',
							color: '#f17742',
							padding: '12px 32px',
							borderRadius: '8px',
							fontWeight: 600,
							textTransform: 'none',
							'&:hover': {
								borderColor: '#e0662e',
								color: '#e0662e',
								backgroundColor: 'rgba(241, 119, 66, 0.05)',
							},
						}}
					>
						Go Home
					</Button>
					<Button
						variant="text"
						onClick={handleReload}
						sx={{
							color: '#717171',
							padding: '12px 32px',
							borderRadius: '8px',
							fontWeight: 600,
							textTransform: 'none',
							'&:hover': {
								backgroundColor: '#f5f5f5',
							},
						}}
					>
						Reload Page
					</Button>
				</Stack>
			</Stack>
		</Box>
	);
};

export default ErrorBoundary;


