import UserType from '../../types/user.type';

interface CategoryOption {
	categoryId: string;
	emoji: string;
	value: string;
	label: string;
}

export default interface Params {
	user : UserType;
	open: boolean;
	onCancel: () => void;
	categories: CategoryOption[];
}