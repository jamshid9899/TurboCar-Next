import Swal from 'sweetalert2';

// ✅ ERROR HANDLING
export const sweetErrorHandling = async (err: any) => {
	await Swal.fire({
		icon: 'error',
		title: 'Oops...',
		text: err.message || 'Something went wrong!',
	});
};

// ✅ TOP SUCCESS ALERT
export const sweetTopSuccessAlert = async (msg: string, duration: number = 2000) => {
	await Swal.fire({
		position: 'top-end',
		icon: 'success',
		title: msg,
		showConfirmButton: false,
		timer: duration,
	});
};

// ✅ CONTACT ALERT
export const sweetContactAlert = async () => {
	await Swal.fire({
		title: 'Contact Information Sent!',
		text: 'The dealer will contact you soon.',
		icon: 'success',
		confirmButtonText: 'OK',
	});
};

// ✅ CONFIRM ALERT
export const sweetConfirmAlert = async (msg: string) => {
	const result = await Swal.fire({
		title: 'Are you sure?',
		text: msg,
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Yes, proceed!',
	});
	return result.isConfirmed;
};

// ✅ LOGIN CONFIRM ALERT
export const sweetLoginConfirmAlert = async (msg: string) => {
	const result = await Swal.fire({
		title: 'Login Required',
		text: msg,
		icon: 'info',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Login Now',
		cancelButtonText: 'Cancel',
	});
	return result.isConfirmed;
};

// ✅ ERROR ALERT
export const sweetErrorAlert = async (msg: string) => {
	await Swal.fire({
		icon: 'error',
		title: 'Error',
		text: msg,
	});
};

// ✅ MIXIN ERROR ALERT
export const sweetMixinErrorAlert = async (msg: string) => {
	const Toast = Swal.mixin({
		toast: true,
		position: 'top-end',
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
	});

	await Toast.fire({
		icon: 'error',
		title: msg,
	});
};

// ✅ MIXIN SUCCESS ALERT
export const sweetMixinSuccessAlert = async (msg: string) => {
	const Toast = Swal.mixin({
		toast: true,
		position: 'top-end',
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
	});

	await Toast.fire({
		icon: 'success',
		title: msg,
	});
};

// ✅ TOP SMALL SUCCESS ALERT
export const sweetTopSmallSuccessAlert = async (msg: string, duration: number = 2000, forward?: () => void) => {
	const Toast = Swal.mixin({
		toast: true,
		position: 'top-end',
		showConfirmButton: false,
		timer: duration,
		timerProgressBar: true,
		didOpen: (toast) => {
			toast.addEventListener('mouseenter', Swal.stopTimer);
			toast.addEventListener('mouseleave', Swal.resumeTimer);
		},
	});

	await Toast.fire({
		icon: 'success',
		title: msg,
	});

	if (forward) {
		forward();
	}
};