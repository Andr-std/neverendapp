import React from "react";
import UserContext from '../contexts/UserContext';
import { apiBaseUrl } from '../config';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stories: [],
    };
  }

  fetchStories = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/story/`, {
        headers: {
          Authorization: `Bearer ${this.props.authToken}`,
        },
      });

      if (!res.ok) throw res;
      const { stories } = await res.json();
      return stories;
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async componentDidMount() {
    const stories = await this.fetchStories();

    this.setState({ stories });
  }

  render() {
    const { stories } = this.state;
    let i = 0;
    return (
      <div className='home-page'>
        <div className='storyBoxBody'>

          {stories.map((story) => {
            const { id, title, subHeading } = story;
            i++
            return (

              <div key={id} id={`id${i}`} className='storyBox'>
                <h3>{title}</h3>
                <p>{subHeading}</p>

                <button className='storyBoxButton'>
                  <a className='storyBoxButtonLink' href={`/story/${id}`}>{`Take a look`}</a>
                </button>

              </div>


            )
          })}

        </div>
      </div>
    );
  }
};

const HomeWithContext = (props) => {
  return (
    <UserContext.Consumer>
      {value => <Home {...props} authToken={value.authToken} currentUserId={value.currentUserId} />}

    </UserContext.Consumer>
  );
}

export default HomeWithContext;
