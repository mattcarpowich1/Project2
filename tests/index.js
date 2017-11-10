const Nightmare = require('nightmare');
const nightmare = new Nightmare();

// click the new riff area, enter C3 in the first step
// should log 'C3'
nightmare
	.goto('http://localhost:3000')
	.click('article:nth-child(1)')
	.wait('.modal-card')
	.click('.modal-step:nth-child(1)')
	.click('tbody > tr > td:nth-child(3)')
	.evaluate(() => {
		return document.getElementById('modal-step-0').value;
	})
	.end()
	.then(text => {
		console.log(text);
	})
	.catch(err => {
		console.log(err);
	});

const nightmare2 = new Nightmare();

nightmare2
	.goto('http://localhost:3000')
	.click('#navbar-login-button')
	.wait('.has-text-grey > a')
	.click('.has-text-grey > a')
	.wait('.box > form')
	.type('#username', 'username')
	.type('#displayName', 'test user')
	.type('#email', 'test@gmail.com')
	.type('#password', 'password')
	.click('#submit-button')
	.wait('#navbar-logo')
	.click('#navbar-logo')
	.wait('article')
	.click('article')
	.wait('#modal-title-input')
	.type('#modal-title-input', 'Test Riff')
	.evaluate(() => {
		return document.getElementById('modal-title-input').value;
	})
	.end()
	.then(text => {
		console.log(text);
	})
	.catch(err => {
		console.log(err);
	});