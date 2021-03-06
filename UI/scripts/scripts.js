/*
_______________________________________________________________________
________________________________________________________________________
*/
const exitSharePopupBtn = document.querySelector(
	'.bg-popup> .share> center> .close-popup'
);
const exitDeletePopupBtn = document.querySelector(
	'.bg-popup> .delete> center> .close-popup'
);
const exitFlagPopupBtn = document.querySelector(
	'.bg-popup> .flag> .close-popup'
);
const deleteBtn = document.querySelector('.delete-article-btn');
const flagBtn = document.querySelector('.flag-article-btn');
const shareBtn = document.querySelector('.share-article-btn');
const bgPopup = document.querySelector('.bg-popup');
const deletePopup = document.querySelector('.bg-popup> .delete');
const flagPopup = document.querySelector('.bg-popup> .flag');
const sharePopup = document.querySelector('.bg-popup> .share');
const body = document.querySelector('.body');
const displayPopup = () => {
	bgPopup.style.display = 'flex';
	body.classList.toggle('no-scroll');
};
const closePopup = () => {
	bgPopup.style.display = 'none';
	body.classList.toggle('no-scroll');
};

shareBtn.addEventListener('click', () => {
	flagPopup.style.display = 'none';
	deletePopup.style.display = 'none';
	sharePopup.style.display = 'block';
	displayPopup();
});
exitSharePopupBtn.addEventListener('click', closePopup);
exitDeletePopupBtn.addEventListener('click', closePopup);
exitFlagPopupBtn.addEventListener('click', closePopup);

/*
___________________________________________________________________
delete article popup
___________________________________________________________________
*/

deleteBtn.addEventListener('click', () => {
	sharePopup.style.display = 'none';
	flagPopup.style.display = 'none';
	deletePopup.style.display = 'block';
	displayPopup();
});
flagBtn.addEventListener('click', () => {
	sharePopup.style.display = 'none';
	deletePopup.style.display = 'none';
	flagPopup.style.display = 'block';
	displayPopup();
});
/*
_____________________________________________________________________
editing an article
______________________________________________________________________
*/
const editArticle = document.querySelector('.edit-article');
const articleTitle = document.querySelector('.article-content> .article-title');
const articleBody = document.querySelector('.article-content> p');
const viewABgPopup = document.querySelector('.view-a-bg-popup');
const closeArticlePopupBtn = document.querySelector('.close-article-popup');

const displayArticlePopup = () => {
	viewABgPopup.style.height = '100%';
	body.classList.toggle('no-scroll');
};
const closeArticlePopup = () => {
	viewABgPopup.style.height = '0%';
	body.classList.toggle('no-scroll');
};
editArticle.addEventListener('click', () => {
	displayArticlePopup();
	document.querySelector(
		'textarea.article-text-edit'
	).textContent = document.querySelector('.article-content> p').textContent;
	document.querySelector(
		'input.article-title-edit'
	).value = document.querySelector(
		'.article-content> .article-title'
	).textContent;
});
closeArticlePopupBtn.addEventListener('click', closeArticlePopup);

/*
__________________________________________________________________
comments
__________________________________________________________________
*/
const nbrComments = document.querySelector('.nbr-comments> i');
const commentBox = document.querySelector('.article-comment');
const commentList = document.querySelector('.comment-list');

const createListElement = (text) => {
	commentList.insertAdjacentHTML(
		'afterbegin',
		`<li><span>You </span>${text}</li>`
	);
};
commentBox.addEventListener('keypress', (e) => {
	if (commentBox.value && commentBox.value.replace(/\s+/, '')) {
		const key = e.which || e.keyCode;
		if (key === 13) {
			createListElement(commentBox.value);
			nbrComments.textContent = `${parseInt(
				nbrComments.textContent.split(' ')[0],
				10
			) + 1} Comments`;
			commentBox.value = '';
		}
	}
});
