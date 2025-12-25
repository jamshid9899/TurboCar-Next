import React, { createContext, useContext, useState, ReactNode } from 'react';
import SignupModal from './SignupModal';

interface SignupModalContextType {
	openSignupModal: (action?: string) => void;
	closeSignupModal: () => void;
}

const SignupModalContext = createContext<SignupModalContextType | undefined>(undefined);

export const useSignupModal = () => {
	const context = useContext(SignupModalContext);
	if (!context) {
		throw new Error('useSignupModal must be used within a SignupModalProvider');
	}
	return context;
};

interface SignupModalProviderProps {
	children: ReactNode;
}

export const SignupModalProvider: React.FC<SignupModalProviderProps> = ({ children }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [action, setAction] = useState<string | undefined>(undefined);

	const openSignupModal = (actionParam?: string) => {
		setAction(actionParam);
		setIsOpen(true);
	};

	const closeSignupModal = () => {
		setIsOpen(false);
		setAction(undefined);
	};

	return (
		<SignupModalContext.Provider value={{ openSignupModal, closeSignupModal }}>
			{children}
			<SignupModal open={isOpen} onClose={closeSignupModal} action={action} />
		</SignupModalContext.Provider>
	);
};




