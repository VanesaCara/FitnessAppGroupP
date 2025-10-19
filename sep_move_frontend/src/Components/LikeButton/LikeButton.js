import React, {useEffect,useState,useRef} from 'react';
import axios from 'axios';
const LikeButton = ({ activityId }) =>{

    const userId = localStorage.getItem("nutzerId");
    
    const [hasLiked, setHasLiked] = useState();
    
    //boolean Wert. LikeButton soll sein Verhalten je nach Wert dieser Variable verändern, z.B. welche onClick handler-Methode ausgeführt wird.
    const [totalLikes, setTotalLikes] = useState('');
    const formdata = {
                      uId: userId,
                      aId: activityId,
                     }
    const API_Base_URL = 'http://localhost:8080/likes';

    
/**********************************************************************like*****************************************************************/
    const like = async () => {

         
                try {
                      
                      const response = await axios.post(`${API_Base_URL}/liking/${activityId}/${userId}`, formdata);
                      
                      if (response.status === 200) {
                
                        setHasLiked(true);
                        alert("Aktivität wurde geliked.");
                    } else {alert("Aktivität komnte nicht geliked werden.");}



                     }
                catch (error){
                                console.error('Aktivität konnte nicht geliked werden:', error);
                              };


    };
    /****************************************************************unlike******************************************************************/
    const unlike = async () => {
                                try {
                                      const response = await axios.delete(`${API_Base_URL}/unliking/${activityId}/${userId}`)
                                       
                                       if (response.status === 200) {
                
                                        setHasLiked(false);
                                        alert("Aktivität wurde unliked.");
                                    } else {alert("Aktivität konnte nicht unliked werden.");}
                                     } 
                                catch (error) {

                                       console.error('Like konnte nicht entfernt werden:', error);
                                               }

                               };
                           
    /******************************************************SwitchHandleMethodDependingOnIfUserLikedTheActivity********************************************************/

     const handleLikeClick = () => {
        if (hasLiked)
        {unlike();}
        else 
        {like();}
                                    };






/********************************checkIfUserAlreadyLikedTheActivityTheCurrentButtonIsAssociatedWith******************************************/

const CheckLike = async ()=> {
                             try {
                                  const response = await axios.get(`${API_Base_URL}/likeStatus/${activityId}/${userId}`);
                                  setHasLiked(response.data);

                                  } 
                             catch (error) {
                                   console.error('Like-Status kann nicht angezeigt werden:', error);
                                            }

                       
                              };

/******************************************************getTotalAmountOfLikes****************************************************************/
 const getAmount = async ()=>  {
                               try {
                                     const response = await axios.get(`${API_Base_URL}/${activityId}/likeAmount`);
                                     setTotalLikes(response.data);
                                    } 
                               catch (error) {
                                     console.error('Like-Amont kann nicht angezeigt werden:', error);
                                  
                                              }
                              }
/*******************************************************setVariablesWhenRenderingComponent***************************************************/
    useEffect ( () => {
                       getAmount();
                       CheckLike();
                    


                       }, [hasLiked]




               );

/***************************************************Style****************************************************************/

const buttonStyle = {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: hasLiked ? "#ff4d4d" : "#4CAF50", 
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s ease",
};

const buttonHoverStyle = {
    backgroundColor: hasLiked ? "#ff6666" : "#45a049",
};
/*******************************************************************************************************************/
return (
    <div>
      
        <div>
            <button onClick={handleLikeClick    }>{totalLikes || 0} {hasLiked ? "Unlike" : "Like"}</button> 
        </div>
    </div>

);






}
export default LikeButton;