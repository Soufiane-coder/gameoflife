import { Dayjs } from "dayjs";

export default interface UserType {
	coins: number;
	displayName: string;
	email : string;
	emailVerified: boolean;
	lastVisit : Dayjs;
	phoneNumber: null | 'string';
	photoUrl : 'string'
	rate: '1' | '2' | '3' | '4' | '5';
	uid: 'string';
	xp: number;
}