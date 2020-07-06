import React from "react";
import UserContext from '../contexts/UserContext';
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css';
import { apiBaseUrl } from '../config';


class Story extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            storyParts: [],
            storyLikes: [],
            storyDislikes: [],
            storyLikeArray: [],
            storyDislikeArray: [],
            commentLikes: [],
            commentDislikes: [],
            commentLikeArray: [],
            commentDislikeArray: [],
            fullStory: [],
            lastPart: "",
            body: "",
            editStory: false,
            editComment: 0,
            addComment: false,
            comments: [],
            lastObj: {},
            story: {}
        };

    }

    fetchStory = async () => {
        const storyId = this.props.match.params.storyId;

        const { authToken } = this.props;
        try {
            const res = await fetch(`${apiBaseUrl}/story/${storyId}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (!res.ok) throw res;
            let { storyParts, story, storyLikes, storyDislikes } = await res.json();

            return ({ storyParts, story, storyLikes, storyDislikes });
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    fetchComment = async () => {
        const storyId = this.props.match.params.storyId;

        const { authToken } = this.props;
        try {
            const res = await fetch(`${apiBaseUrl}/comment/storyId/${storyId}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (!res.ok) throw res;
            let { comments } = await res.json();

            return ({ comments });
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    async componentDidMount() {
        let { comments } = await this.fetchComment();
        let { storyParts, story, storyLikes, storyDislikes } = await this.fetchStory();
        let { storyLikeArray, storyDislikeArray } = this.state;

        storyLikes.forEach(storyLike => storyLikeArray.push(storyLike.userId))
        storyDislikes.forEach(storyDislike => storyDislikeArray.push(storyDislike.userId))

        let { fullStory } = this.state;

        storyParts.forEach(storyPart => { fullStory.push(storyPart.body) })
        this.setState({ storyParts, fullStory, comments, story, storyLikeArray, storyDislikeArray });
    }
    storyEdit = () => {

        let { currentUserId } = this.props;
        currentUserId = parseInt(currentUserId, 10)
        let { storyParts, lastPart } = this.state;

        this.setState({ fullStory: [] }, () => {
            let { fullStory } = this.state;
            if (storyParts.length > 0 && storyParts[storyParts.length - 1].userId === currentUserId) {
                let lastObj = storyParts.pop()
                this.setState({ lastObj });
                lastPart = lastObj.body
            } else if (storyParts.length > 0) {
                let lastObj = {};
                lastObj.userId = currentUserId
                lastObj.storyId = storyParts[0].storyId
                lastObj.orderNo = storyParts.length + 1
                this.setState({ lastObj });
            }
            storyParts.forEach(storypart => { fullStory.push(storypart.body) })
            this.setState({ editStory: true, storyParts, lastPart, fullStory });
        });
    }

    commentEdit = (id) => {
        this.setState({ editComment: id })

    }
    storySave = async () => {

        let { storyParts } = this.state;
        this.setState({ fullStory: [] }, () => {
            let { fullStory, lastPart } = this.state;

            if (storyParts.length > 0) {
                storyParts.forEach(storypart => { fullStory.push(storypart.body) })
            }
            fullStory.push(lastPart)
            this.setState({ editStory: false, storyParts, lastPart, fullStory });
        });
        let { lastObj, lastPart } = this.state

        const { authToken } = this.props;
        if (lastObj && lastObj.body) {
            try {
                const res = await fetch(`${apiBaseUrl}/story/storyPart/${lastObj.id}`, {
                    method: "PUT",
                    body: JSON.stringify({ body: lastPart, storyId: lastObj.storyId, orderNo: lastObj.orderNo, userId: lastObj.userId }),
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${authToken}`
                    }
                });
                if (!res.ok) {
                    throw res;
                }
            } catch (err) {
                console.error(err);
                return [];
            }
        } else if (lastObj) {
            try {
                const res = await fetch(`${apiBaseUrl}/story/storyPart`, {
                    method: "POST",
                    body: JSON.stringify({ body: lastPart, storyId: lastObj.storyId, orderNo: lastObj.orderNo, userId: lastObj.userId }),
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${authToken}`
                    }
                });
                if (!res.ok) {
                    throw res;
                }
            } catch (err) {
                console.error(err);
                return [];
            }
        }
    }
    commentSave = async (id) => {

        const storyId = this.props.match.params.storyId;
        let { currentUserId } = this.props;
        let { body, editComment } = this.state;
        let userId = parseInt(currentUserId, 10)
        const { authToken } = this.props;
        if (editComment) {
            try {
                const res = await fetch(`${apiBaseUrl}/comment/${id}`, {
                    method: "PUT",
                    body: JSON.stringify({ body, storyId, userId, id }),
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${authToken}`
                    }
                });
                if (!res.ok) {
                    throw res;
                } else {
                    const { comments } = await res.json();
                    this.setState({ comments: comments, editComment: 0 })
                }
            } catch (err) {
                console.error(err);
                return [];
            }

        } else {
            try {
                const res = await fetch(`${apiBaseUrl}/comment/`, {
                    method: "POST",
                    body: JSON.stringify({ body, storyId, userId }),
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${authToken}`
                    }
                });
                if (!res.ok) {
                    throw res;
                } else {
                    const { comments } = await res.json();
                    this.setState({ comments: comments, addComment: false })

                }
            } catch (err) {
                console.error(err);
                return [];
            }
        }

    }
    commentAdd = () => {

        this.setState({ addComment: true })
    }
    handleEditorChange = ({ text }) => {
        this.setState({ lastPart: text })
    }
    handleEditorCommentChange = ({ text }) => {
        this.setState({ body: text })
    }
    likeAdd = async () => {

        let { currentUserId } = this.props;
        let userId = parseInt(currentUserId, 10)
        const storyId = this.props.match.params.storyId;
        const { authToken } = this.props;
        try {
            const res = await fetch(`${apiBaseUrl}/story/${storyId}/likes/${userId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${authToken}`
                    }
                });
            if (!res.ok) {
                throw res;
            } else {
                const { storyLikes } = await res.json()

                this.setState({ storyLikes })

                let { storyLikeArray } = this.state;

                storyLikes.forEach(storyLike => storyLikeArray.push(storyLike.userId))

                this.setState({ storyLikeArray });

            }
        } catch (err) {
            console.error(err);
            return [];
        }

    }
    disLikeAdd = async () => {

        let { currentUserId } = this.props;
        let userId = parseInt(currentUserId, 10)
        const storyId = this.props.match.params.storyId;
        const { authToken } = this.props;
        try {
            const res = await fetch(`${apiBaseUrl}/story/${storyId}/dislikes/${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                }
            });
            if (!res.ok) {
                throw res;
            } else {
                const { storyDislikes } = await res.json()
                this.setState({ storyDislikes })
                let { storyDislikeArray } = this.state;


                storyDislikes.forEach(storyDislike => storyDislikeArray.push(storyDislike.userId))

                this.setState({ storyDislikeArray });

            }
        } catch (err) {
            console.error(err);
            return [];
        }

    }
    commentLikeAdd = async (id) => {
        const storyId = this.props.match.params.storyId;
        let { currentUserId } = this.props;
        let userId = parseInt(currentUserId, 10)
        const { authToken } = this.props;
        try {
            const res = await fetch(`${apiBaseUrl}/comment/${id}/likes/${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                }
            });
            if (!res.ok) {
                throw res;
            } else {

                const resp = await fetch(`${apiBaseUrl}/comment/storyId/${storyId}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });

                if (!resp.ok) throw res;
                let { comments } = await resp.json();

                this.setState({ comments })

            }
        } catch (err) {
            console.error(err);
            return [];
        }
    }
    commentDislikeAdd = async (id) => {
        const storyId = this.props.match.params.storyId;
        let { currentUserId } = this.props;
        let userId = parseInt(currentUserId, 10)
        const { authToken } = this.props;
        try {
            const res = await fetch(`${apiBaseUrl}/comment/${id}/dislikes/${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                }
            });
            if (!res.ok) {
                throw res;
            } else {
                const resp = await fetch(`${apiBaseUrl}/comment/storyId/${storyId}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });

                if (!resp.ok) throw resp;
                let { comments } = await resp.json();

                this.setState({ comments })

            }
        } catch (err) {
            console.error(err);
            return [];
        }

    }
    commentDelete = async (id) => {
        const storyId = this.props.match.params.storyId;
        const { authToken } = this.props;

        const commentLikesRes = await fetch(`${apiBaseUrl}/comment/${id}/likes`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        if (!commentLikesRes.ok) {
            throw commentLikesRes;
        }

        const commentDislikesRes = await fetch(`${apiBaseUrl}/comment/${id}/dislikes`, {
            method: 'DELETE',

            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        if (!commentDislikesRes.ok) {
            throw commentDislikesRes;
        }


        const commentUserRes = await fetch(`${apiBaseUrl}/comment/${id}`,
            {
                method: 'DELETE',
                body: JSON.stringify({ storyId }),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`,
                },
            })
        if (!commentUserRes.ok) {
            throw commentUserRes;
        } else {
            let { comments } = await commentUserRes.json();

            this.setState({ comments })
        }

    }



    storyDelete = async () => {
        const storyId = this.props.match.params.storyId;
        const { authToken } = this.props;
        const storyDelRes = await fetch(`${apiBaseUrl}/comment/storyId/${storyId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        if (!storyDelRes.ok) {
            throw storyDelRes;
        }
        const { comments } = await storyDelRes.json();

        let commentLikesToDelete = [];
        let commentDislikesToDelete = [];
        comments.forEach(commentelem => {
            if (commentelem.commentLikes.length > 0) {

                commentLikesToDelete.push(commentelem.id)

            }
            if (commentelem.commentDislikes.length > 0) {

                commentDislikesToDelete.push(commentelem.id)

            }
        })
        commentLikesToDelete = [...new Set(commentLikesToDelete)]
        commentDislikesToDelete = [...new Set(commentDislikesToDelete)]

        const deleteCommentLikeRes = await fetch(`${apiBaseUrl}/comment/likes`,
            {
                method: 'DELETE',
                body: JSON.stringify(commentLikesToDelete),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`,
                },
            })
        if (!deleteCommentLikeRes.ok) {
            throw deleteCommentLikeRes;
        }
        const deleteCommentDislikeRes = await fetch(`${apiBaseUrl}/comment/dislikes`,
            {
                method: 'DELETE',
                body: JSON.stringify(commentDislikesToDelete),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`,
                },
            })
        if (!deleteCommentDislikeRes.ok) {
            throw deleteCommentDislikeRes;
        }
        const deleteCommentRes = await fetch(`${apiBaseUrl}/comment/story/${storyId}`, {
            method: 'DELETE', headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        if (!deleteCommentRes.ok) {
            throw deleteCommentRes;
        }

        const deleteLikeRes = await fetch(`${apiBaseUrl}/story/storyLikes/${storyId}`, {
            method: 'DELETE', headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        if (!deleteLikeRes.ok) {
            throw deleteLikeRes;
        }

        const deleteDislikeRes = await fetch(`${apiBaseUrl}/story/storyDislikes/${storyId}`, {
            method: 'DELETE', headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        if (!deleteDislikeRes.ok) {
            throw deleteLikeRes;
        }

        const deleteStoryRes = await fetch(`${apiBaseUrl}/story/${storyId}`, {
            method: 'DELETE', headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        if (!deleteStoryRes.ok) {
            throw deleteStoryRes;
        }
        window.location.href = `/`

    }

    render() {
        let { currentUserId } = this.props;
        currentUserId = parseInt(currentUserId, 10)
        let { lastPart, fullStory, editStory,
            editComment, comments, story, addComment, storyLikeArray, storyDislikeArray } = this.state;

        const mdParser = new MarkdownIt(/* Markdown-it options */);
        const storyComments = (comments.length)
            ? comments.map((comment) => {
                let commentLikeArray = [];
                let commentDislikeArray = [];

                const { id, body, userId, commentLikes, commentDislikes } = comment;
                commentLikes.forEach(commentLike => commentLikeArray.push(commentLike.userId))
                commentDislikes.forEach(commentDislike => commentDislikeArray.push(commentDislike.userId))

                return (
                    <div key={id} className='commentPart'>

                        {((userId === currentUserId && editComment === id)) ?
                            <div >
                                <button className="commentButtons" onClick={() => this.commentSave(id)}>Save Comment</button>
                                {commentLikeArray.includes(currentUserId) ? null : <button className="commentButtons" onClick={() => this.commentLikeAdd(id)}>Like</button>}
                                {commentDislikeArray.includes(currentUserId) ? null : <button className="commentButtons" onClick={() => this.commentDislikeAdd(id)}>Don't Like</button>}
                                {currentUserId === userId ? < button className="commentButtons" onClick={() => this.commentDelete(id)}>Delete Comment</button> : null}

                                <MdEditor
                                    value={body}
                                    style={{ height: "500px" }}
                                    renderHTML={(text) => mdParser.render(text)}
                                    onChange={this.handleEditorCommentChange}
                                />
                            </div> : null}
                        {(userId === currentUserId && editComment !== id) ?
                            <div >
                                <p>{body}</p>
                                <button className="commentButtons" onClick={() => this.commentEdit(id)}>Edit Comment</button>
                                {commentLikeArray.includes(currentUserId) ? null : <button className="commentButtons" onClick={() => this.commentLikeAdd(id)}>Like</button>}
                                {commentDislikeArray.includes(currentUserId) ? null : <button className="commentButtons" onClick={() => this.commentDislikeAdd(id)}>Don't Like</button>}
                                {currentUserId === userId ? < button className="commentButtons" onClick={() => this.commentDelete(id)}>Delete Comment</button> : null}
                            </div> : null}
                        {(userId !== currentUserId) ?
                            <div >
                                <p>{body}</p>
                                {commentLikeArray.includes(currentUserId) ? null : <button className="commentButtons" onClick={() => this.commentLikeAdd(id)}>Like</button>}
                                {commentDislikeArray.includes(currentUserId) ? null : <button className="commentButtons" onClick={() => this.commentDislikeAdd(id)}>Don't Like</button>}
                                {currentUserId === userId ? < button className="commentButtons" onClick={() => this.commentDelete(id)}>Delete Comment</button> : null}
                            </div> : null}
                    </div>
                )
            })
            : <p>This story has no comments! :(</p>
        return (
            <div className="story-page">
                <div className="container">
                    <div className="storyPart">

                        <h1>{story.title}</h1>
                        <h3 className='subtitle'>{story.subHeading}</h3>
                        <p>{fullStory}</p>
                        {editStory ? <MdEditor
                            value={lastPart}
                            style={{ height: "500px" }}
                            renderHTML={(text) => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                        /> : null}
                    </div>
                    <div>
                        {editStory ? <button className="storyButtons" onClick={this.storySave}>Save Story</button> : <button className="storyButtons" onClick={this.storyEdit}>Edit Story</button>}
                        {currentUserId === story.userId ? <button className="storyButtons" onClick={this.storyDelete}>Delete Story</button> : null}
                        {addComment ? null : < button className="storyButtons" onClick={this.commentAdd}>Add Comment</button>}
                        {storyLikeArray.includes(currentUserId) ? null : <button className="storyButtons" onClick={this.likeAdd}>Like</button>}
                        {storyDislikeArray.includes(currentUserId) ? null : <button className="storyButtons" onClick={this.disLikeAdd}>Don't Like</button>}
                    </div>

                    {storyComments}
                    {addComment ? <button className='site-button2' onClick={this.commentSave}>Save Comment</button> : null}
                    {addComment ? <MdEditor
                        value=""
                        style={{ height: "500px" }}
                        renderHTML={(text) => mdParser.render(text)}
                        onChange={this.handleEditorCommentChange}
                    />

                        : null}

                </div>
            </div>
        );
    }
};

const StoryWithContext = (props) => {

    return (
        <div >
            <UserContext.Consumer>
                {userValue => (

                    <Story {...props}

                        authToken={userValue.authToken}
                        currentUserId={userValue.currentUserId} />
                )}

            </UserContext.Consumer>

        </div>
    );
}

export default StoryWithContext;
