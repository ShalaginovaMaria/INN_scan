import css from './ArticleCard.module.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import {decode} from 'html-entities';

const ArticleCard = (props) => {

    const {card} = props;

    const navigate = useNavigate();
    useEffect(() => {
        
        let token  = localStorage.getItem('tokenInfo');

        //если нет токена, то перенаправление на страницу авторизации
        if (!token) {
            navigate('/login');
        }        
      }, []);


    const date = new Date(card?.issueDate).toLocaleDateString();
    const {url, textNews} = getTextNews(card?.markup);

    function imageUrl(decodedContent) {
        const images=decodedContent.match(/<img src="(.*?)"/m);
        return images ? images[1] : "";
    };

    function decodeTextNews(markup)  {
        return decode(markup);
    };

    function removeAllTags(textNews) {
        return textNews.replace(/<.*?>/g, ' ');
    };

    function getTextNews(markup) {
       const decodedTextNews = decodeTextNews(card?.content?.markup);
       const url = imageUrl(decodedTextNews);
       const textNews = removeAllTags(decodedTextNews).slice(0, 700) + '...';

       return {
        url,
        textNews
       };
    }

    function openUrl() {
        window.open(card.url, "_blank");
    };
   
    function getTypeNews(attributes) {
        if (attributes?.isTechNews) {
            return "Технические новости"
        };
        if (attributes?.isAnnouncement) {
            return "Анонсы и события"
        };
        if (attributes?.isDigest) {
            return "Сводки новостей"
        };
    }

    return (
        <div className={css.card}>
            <div className={css.cardTop}> 
                <p>{date}</p>&nbsp;&nbsp; 
                <a href='#'>{card?.source.name}</a>
            </div>    

            <h3>{card?.title.text}</h3>
            <div className={css.newsType}>{getTypeNews(card?.attributes)}</div>
            {url && (<img className={css.imgNews} src={url} alt='news img' />)}
             <div className={css.text}>
                <div><p>{textNews}</p></div>
            </div> 
            <div className={css.cardBottom}> 
                <button className={css.readButton} onClick={openUrl}>Читать в источнике</button>
                <div className={css.words}><p>{card?.attributes.wordCount} слов</p></div>
            </div>    
                    
        </div>
    )
}

export default ArticleCard