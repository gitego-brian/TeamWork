const mockData = {
	signupComplete1: {
		firstName: 'Bran',
		lastName: 'Stark',
		email: 'bstark@gmail.com',
		password: 'Password@123',
		gender: 'male',
		jobRole: 'Software engineer',
		department: 'engineering',
		address: 'Houston'
	},
	signupComplete2: {
		firstName: 'Ben',
		lastName: 'Gisa',
		email: 'bengisa@gmail.com',
		password: 'Password@123',
		gender: 'male',
		jobRole: 'Data analyst',
		department: 'Investigation',
		address: 'Kicukiro'
	},
	baraka: {
		firstName: 'Baraka',
		lastName: 'Mugisha',
		email: 'mugishaje@gmail.com',
		password: 'Password@123',
		gender: 'male',
		jobRole: 'Marketing assistant',
		department: 'Marketing',
		address: 'Houston'
	},
	james: {
		firstName: 'James',
		lastName: 'Nyagatare',
		email: 'jimnyagtr@gmail.com',
		password: 'Password@123',
		gender: 'male',
		jobRole: 'Back-end developer',
		department: 'Web development',
		address: 'Gatenga'
	},
	signupIncomplete: {
		firstName: 'Bran',
		lastName: 'stark',
		email: 'bstark@gmail.com',
		password: 'Password@123',
		department: 'engineering'
	},
	signupShortPwd: {
		firstName: 'Bran',
		lastName: 'stark',
		email: 'bstark@gmail.com',
		password: 'Pass@1',
		gender: 'male',
		jobRole: 'Software engineer',
		department: 'engineering'
	},
	signupNoNumPwd: {
		firstName: 'Bran',
		lastName: 'stark',
		email: 'bstark@gmail.com',
		password: 'Passwowow@!oword',
		gender: 'male',
		jobRole: 'Software engineer',
		department: 'engineering'
	},
	signupNoCharPwd: {
		firstName: 'Bran',
		lastName: 'stark',
		email: 'bstark@gmail.com',
		password: 'Password123',
		gender: 'male',
		jobRole: 'Software engineer',
		department: 'engineering'
	},
	signupNoUcasePwd: {
		firstName: 'Bran',
		lastName: 'stark',
		email: 'bstark@gmail.com',
		password: 'password@123',
		gender: 'male',
		jobRole: 'Software engineer',
		department: 'engineering'
	},
	signupNumFname: {
		firstName: '1234',
		lastName: 'stark',
		email: 'bstark@gmail.com',
		password: 'Password@123',
		gender: 'male',
		jobRole: 'Software engineer',
		department: 'engineering'
	},
	signupNumLname: {
		firstName: 'Bran',
		lastName: '1234',
		email: 'bstark@gmail.com',
		password: 'Password@123',
		gender: 'male',
		jobRole: 'Software engineer',
		department: 'engineering'
	},
	signupSpaceFname: {
		firstName: 'Bran Bob',
		lastName: 'stark',
		email: 'bstark@gmail.com',
		password: 'Password@123',
		gender: 'male',
		jobRole: 'Software engineer',
		department: 'engineering'
	},
	signupSpaceLname: {
		firstName: 'Bran',
		lastName: 'Stark Man',
		email: 'bstark@gmail.com',
		password: 'Password@123',
		gender: 'male',
		jobRole: 'Software engineer',
		department: 'engineering'
	},
	signupGenderUnclear: {
		firstName: 'Bran',
		lastName: 'stark',
		email: 'bstark@gmail.com',
		password: 'Password@123',
		gender: 'ma',
		jobRole: 'Software engineer',
		department: 'engineering'
	},
	loginComplete: {
		email: 'bengisa@gmail.com',
		password: 'Password@123'
	},
	loginWrongPwd: {
		email: 'bengisa@gmail.com',
		password: 'Password@345'
	},
	loginNoAccount: {
		email: 'brucesangwa@gmail.com',
		password: 'Password@123'
	},
	article: {
		title: 'Just a sign',
		article:
      'Looking at the world through my rearview, searching for an answer up high, or is it all wasted time?'
	},
	article2: {
		title: 'Just another sign',
		article:
      'Looking at the world through my rearview, searching for an answer up high, or is it all wasted time?'
	},
	article3: {
		title: 'Just another newer sign',
		article:
      'Looking at the world through my rearview, searching for an answer up high, or is it all wasted time?'
	},
	article4: {
		title: 'Just another even newer sign',
		article:
      'Looking at the world through my rearview, searching for an answer up high, or is it all wasted time?'
	},
	shortTitle: {
		title: 'J',
		article:
      'Looking at the world through my rearview, searching for an answer up high, or is it all wasted time?'
	},
	shortArticle: {
		title: 'Just a sign',
		article: 'Looking'
	},
	comment: {
		comment: 'Great'
	},
	comment2: {
		comment: 'Amaziiinng'
	},
	flag: {
		reason: 'inappropriate'
	},
	shortFlag: {
		reason: 'dumb'
	},
	editedArticle: {
		title: 'This sign has just been edited',
		article:
      'Looking at the world through my rearview, searching for an answer up high, or is it all wasted time?'
	},
	editedArticle2: {
		title: 'Just another edited sign',
		article:
      'Looking at the world through my rearview, searching for an answer up high, or is it all wasted time?'
	}
};

export default mockData;
