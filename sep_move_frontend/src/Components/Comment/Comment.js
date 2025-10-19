import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Comment.css';

const Comment = () => {
    const { activityId } = useParams(); // This will get the 'activityId' from the URL
    const userId = localStorage.getItem('nutzerId');
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        fetchComments();
    }, [activityId]);

    const fetchComments = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/comments/${activityId}`);
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const addComment = async () => {
        if (!newComment.trim()) {
            alert('Comment text cannot be empty!');
            return;
        }

        try {
            console.log('activityId:', activityId, 'userId:', userId); // Ensure activityId and userId are correct

            const response = await axios.post(
                'http://localhost:8080/comments/add',
                { text: newComment },
                {
                    params: {
                        activityId, // Pass the activityId as a query parameter
                        authorId: userId,
                    },
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            alert(response.data);
            setNewComment('');
            fetchComments();
        } catch (error) {
            console.error('Error adding comment:', error);
            alert(`Failed to add comment: ${error.response?.data?.message || error.message}`);
        }
    };

    const deleteComment = async (commentId) => {
        try {
            const response = await axios.delete(`http://localhost:8080/comments/${commentId}/remove`, {
                params: { userId },
            });
            alert(response.data);
            fetchComments();
        } catch (error) {
            console.error('Error deleting comment:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                alert(`Failed to delete comment: ${error.response.data.message || error.message}`);
            } else {
                alert('An unknown error occurred while deleting the comment');
            }
        }
    };

    return (
        <div className="comment-container">
            <h2>Comments</h2>
            {/* Display the list of comments */}
            <ul className="comment-list">
                {comments.map((comment) => (
                    <li key={comment.id}>
                        <p>{comment.text}</p>
                        {/* Render the delete button only if the text is not restricted */}
                        {!['[Vom Autor entfernt.]', '[Vom Admin entfernt.]'].includes(comment.text) && (
                            <button onClick={() => deleteComment(comment.id)}>Delete</button>
                        )}
                    </li>
                ))}
            </ul>

            {/* Input field to add a new comment */}
            <div className="add-comment-container">
                <textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <button onClick={addComment}>Submit</button>
            </div>
        </div>
    );
};

export default Comment;
