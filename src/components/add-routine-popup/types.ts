import RoutineType from '../../types/routine.type';
import UserType from '../../types/user.type';
import { PropsFromRedux } from './add-routine-popup.component';
interface CategoryOption {
	categoryId: string;
	emoji: string;
	value: string;
	label: string;
}

export default interface Params extends PropsFromRedux {
	user : UserType;
	open: boolean;
	onCancel: () => void;
	categories: CategoryOption[];
	routineToEdit: RoutineType | undefined;
}