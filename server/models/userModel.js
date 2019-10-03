import uuidv1 from 'uuid/v1';

class User {
	constructor(
		_firstName,
		_lastName,
		_email,
		_password,
		_gender,
		_jobRole,
		_department,
		_address
	) {
		this.id = `user-${uuidv1().split('-')[0]}`;
		this.firstName = _firstName;
		this.lastName = _lastName;
		this.email = _email;
		this.password = _password;
		this.gender = _gender;
		this.jobRole = _jobRole;
		this.department = _department;
		this.address = _address;
		this.isAdmin = false;
	}
}

export default User;
