import { IsNotEmpty, IsEmail } from 'class-validator'

export class UpdateUserDto {
	@IsNotEmpty()
	first_name: string;
	@IsNotEmpty()
	last_name: string;
	@IsNotEmpty()
	address:string;
	@IsEmail()
	email:string;
	old_password:string;
	new_password:string;
	confirm_new_password:string;
}
