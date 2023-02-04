import { Client, Collection } from 'discord.js';
import { ICommand } from './ICommand';
import { IEvent } from './IEvent';

export interface IExtendedClient extends Client {
	commands?: Collection<string, ICommand>;
	events?: Collection<string, IEvent>;
}
