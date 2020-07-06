import React from "react";
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css';
import UserContext from '../contexts/UserContext';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { apiBaseUrl } from '../config';

class StoryCreate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            subHeading: "",
            categoriesArr: [],
            categoryId: 0,
            isEditLock: false,
            body: "",
            orderNo: 1

        };
    }
    onSelect = (e) => {

        this.setState({ categoryId: e.value })

    }
    async componentDidMount() {
        const { authToken } = this.props;
        const { categoriesArr } = this.state
        try {

            const categoriesRes = await fetch(`${apiBaseUrl}/storycategories`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            if (!categoriesRes) {
                throw categoriesRes;
            } else {
                const { categories } = await categoriesRes.json();
                categories.forEach(category => {
                    categoriesArr.push({ "value": category.id, "label": category.categoryName })


                    this.setState({ categoriesArr })

                })
            }
        }
        catch { }
    }
    storySave = async (e) => {
        e.preventDefault();

        let { body, title, subHeading, orderNo, categoryId, isEditLock } = this.state

        let { currentUserId } = this.props;
        currentUserId = parseInt(currentUserId, 10)
        title = document.getElementById('markdown-title-editor').value
        subHeading = document.getElementById('markdown-subheader-editor').value

        const { authToken } = this.props;

        try {
            const res = await fetch(`${apiBaseUrl}/story/`, {
                method: "POST",
                body: JSON.stringify({
                    body, title, subHeading, userId: currentUserId, orderNo, categoryId,
                    isEditLock
                }),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                }
            });
            if (!res.ok) {
                throw res;
            } else {

                window.location.href = `/`
            }
        } catch (err) {
            console.error(err);
            return [];
        }

    }
    handleEditorChange = ({ text }) => {
        this.setState({ body: text })
    }
    render() {
        const mdParser = new MarkdownIt(/* Markdown-it options */);
        const { categoriesArr } = this.state
        const defaultOption = 1;

        return (

            <div className="storyCreate-form-page">
                <form className="storyCreateForm">

                    <div className="titles">Title:</div>
                    <input className='inputs' id='markdown-title-editor' name="title"></input>
                    <div className="titles">Subheading:</div>
                    <input className='inputs' id='markdown-subheader-editor' name="subHeading"></input>
                    <div className="titles">Category:</div>
                    <Dropdown className='inputs' id='select-category' options={categoriesArr} onChange={this.onSelect} value={defaultOption} placeholder="Select an option" />
                    <button className='site-button' onClick={this.storySave} type="submit">Save Story</button>
                    <div className="titles">Story:</div>
                    <MdEditor
                        value=''
                        style={{ height: "500px" }}
                        renderHTML={(text) => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                    />

                </form>
            </div>
        );

    };
}
const StoryCreateWithContext = (props) => {
    return (
        <UserContext.Consumer>
            {userValue => (

                <StoryCreate {...props}

                    authToken={userValue.authToken}
                    currentUserId={userValue.currentUserId} />
            )}

        </UserContext.Consumer>
    )
}
export default StoryCreateWithContext
