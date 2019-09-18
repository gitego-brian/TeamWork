/*
______________________________________________________________________________________________________
Share article Popup
______________________________________________________________________________________________________
*/
const exitPopupBtn = document.querySelector('.close-popup');
const shareBtn = document.querySelector('.share-article-btn');
const bgPopup = document.querySelector('.bg-popup');
const body = document.querySelector('.body');
const displayPopup = () => {
    bgPopup.style.display = 'flex';
    body.classList.toggle('no-scroll');

}
const closePopup = () => {
    bgPopup.style.display = 'none';
    body.classList.toggle('no-scroll');
}

shareBtn.addEventListener('click', () => {
    document.querySelector('.popup div').textContent = 'Share article?';
    document.querySelector('.popup a').textContent = 'Share';
    document.querySelector('.popup').classList.remove('share');
    document.querySelector('.popup').classList.remove('delete');
    document.querySelector('.popup').classList.add('share');
    displayPopup();
});
exitPopupBtn.addEventListener('click', closePopup);

/*
______________________________________________________________________________________________________
delete article popup
______________________________________________________________________________________________________
*/

const deleteBtn = document.querySelector('.delete-article-btn');

deleteBtn.addEventListener('click', () => {
    document.querySelector('.popup div').textContent = 'Delete article?';
    document.querySelector('.popup a').textContent = 'Delete';
    document.querySelector('.popup').classList.remove('share');
    document.querySelector('.popup').classList.remove('delete');
    document.querySelector('.popup').classList.add('delete');
    displayPopup();
})

/*
______________________________________________________________________________________________________
editing an article
______________________________________________________________________________________________________
*/
const editArticle = document.querySelector('.edit-article');
const articleTitle = document.querySelector('.article-content> .article-title');
const articleBody = document.querySelector('.article-content> p');
const viewABgPopup = document.querySelector('.view-a-bg-popup');
const closeArticlePopupBtn = document.querySelector('.close-article-popup');


const displayArticlePopup = () => {
    viewABgPopup.style.height = '100%';
    body.classList.toggle('no-scroll');
}
const closeArticlePopup = () => {
    viewABgPopup.style.height = '0%';
    body.classList.toggle('no-scroll');
}
editArticle.addEventListener('click', () => {
    displayArticlePopup();
    document.querySelector('textarea.article-text-edit').value = document.querySelector('.article-content> p').textContent;
    document.querySelector('input.article-title-edit').value = document.querySelector('.article-content> .article-title').textContent;
})
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
    commentList.insertAdjacentHTML('afterbegin', `<li><span>You </span>${text}</li>`);
}
commentBox.addEventListener('keypress', (e) => {
    if(commentBox.value && commentBox.value.replace(/\s+/,"")){
    let key = e.which || e.keyCode;
    if (key === 13) {
        createListElement(commentBox.value);
        nbrComments.textContent = `${parseInt(nbrComments.textContent.split(' ')[0])+1} Comments`;
        commentBox.value = "";
    }
}
});


