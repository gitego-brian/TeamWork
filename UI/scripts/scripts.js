/*
_______________________________________________________________________
________________________________________________________________________
*/
const exitSharePopupBtn = document.querySelector(
	'.bg-popup> .share> .close-popup'
);
const exitDeletePopupBtn = document.querySelector(
	'.bg-popup> .delete> .close-popup'
);
const shareBtn = document.querySelector('.share-article-btn');
const bgPopup = document.querySelector('.bg-popup');
const deletePopup = document.querySelector('.bg-popup> .delete');
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
	deletePopup.style.display = 'none';
	sharePopup.style.display = 'block';
	displayPopup();
});
exitSharePopupBtn.addEventListener('click', closePopup);
exitDeletePopupBtn.addEventListener('click', closePopup);

/*
___________________________________________________________________
delete article popup
___________________________________________________________________
*/

const deleteBtn = document.querySelector('.delete-article-btn');

deleteBtn.addEventListener('click', () => {
	sharePopup.style.display = 'none';
	deletePopup.style.display = 'block';
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
	).value = document.querySelector('.article-content> p').textContent;
	document.querySelector(
		'input.article-title-edit'
	).value = document.querySelector(
		'.article-content> .article-title'
	).textContent;
});
closeArticlePopupBtn.addEventListener('click', closeArticlePopup);

/*
______________________________________________________________________________________________________
comments
______________________________________________________________________________________________________
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
				nbrComments.textContent.split(' ')[0]
			) + 1} Comments`;
			commentBox.value = '';
		}
	}
});
