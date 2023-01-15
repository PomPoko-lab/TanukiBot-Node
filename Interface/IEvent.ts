export interface IEvent {
	name: string;
	function: (...args: any[]) => void;
	once?: boolean;
}
