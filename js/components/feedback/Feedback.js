 import './feedback.css';
 import React from "react";

 import Actions from "../../actions/Actions";
 import { ActionTypes } from "../../constants/constants";
 import AppStore from '../../stores/AppStore';

 var Isvg = require('react-inlinesvg');

 export default class Feedback extends React.Component {

    constructor(props) {
        super(props);
        this.validEmail = false;
        this.checkEmail = this.checkEmail.bind(this);
        this.onSendFeedback = this.onSendFeedback.bind(this);
        this.onToggleFeedback = this.onToggleFeedback.bind(this);
    }

    componentDidMount() {

    }
    componentDidUpdate() {
        setTimeout(() => this.refs.email.focus());
    }
    render() {

        let feedbackObject = AppStore.getFeedbackObject();
        let feedbackWrapperStyle = {
            display: this.props.feedbacking && window.portfolio_showFeedbackButton ? 'block' : 'none',
        };
        let feedbackButtonStyle = {
            display: window.portfolio_showFeedbackButton ? 'inherit' : 'none',
        };

        var interestAction;
        var interestContacts;
        var interestSlug;
        var headline;

        if (feedbackObject.interest) {
            interestAction = <input type="hidden" name="action" value={'submit_'+feedbackObject.interest}/>;
            interestContacts = <input type="hidden" name="contacts" value={window.btoa(feedbackObject.contacts)}/>
            interestSlug = <input type="hidden" name="slug" value={feedbackObject.slug }/>
            if (feedbackObject.interest === "info") {
                headline = <div className="feedback-headline" >Do you want more information about the project {feedbackObject.title}?</div>
            } else {
                headline = <div className="feedback-headline" >Co-Innovate with us!</div>
            }
        } else {
            headline = <div className="feedback-headline feedback-headline-extra-space" >Do you have feedback?</div>
            interestAction = <input type="hidden" name="action" value="submit_general_feedback"/>;
            interestContacts = null;
            interestSlug = null;
        }
        return (
            <div className="feedback" style={feedbackButtonStyle}>
              <span className="typeform-share" data-mode="1"  onClick={this.onToggleFeedback} >
                  <img src={`${window.icnThemePath}img/feedback.svg`} className="feedback__icon"/>
              </span>
              <div className="feedbackWrapper" style={feedbackWrapperStyle}>
              <div className="feedbackScroller">

                <iframe width="0" height="0" border="0" style={{visibility:"hidden"}} name="invisDummyFrame" id="invisDummyFrame"></iframe>
                <form action={this.props.feedbackUrl} method="POST" encType="multipart/form-data" target="invisDummyFrame">
                  <div className="form-content">
                    {interestAction}
                    {interestContacts}
                    {interestSlug}
                    {headline}
                    <div className="feedback-headline">
                      <input name="email" ref="email" className="feedback-headline-email" type="text" size="30" placeholder="your e-mail address" onChange={this.checkEmail}/>
                      <textarea name="message" className="feedback-headline-message" rows="7" cols="30" placeholder="Please type in your comments, feedback, questions ... "></textarea>
                    </div>
                    <div className="feedback-send-button-div">
                      <button className="feedback-send-button" onClick={this.onSendFeedback} type="submit">Send</button>
                    </div>
                  </div>
                </form>

                {/* -- exit button --*/}
                <div onClick={this.onToggleFeedback}>
                  <div className={`detailview__exitbutton ${feedbackObject.category}`} onClick={this.onToggleFeedback}>
                    <Isvg src={window.icnThemePath + 'img/exit.svg'}/>
                    <span className="detailview__exitbutton__overlay" onClick={this.onToggleFeedback}></span>
                  </div>
                </div>

              </div>
            </div>
            </div>
        );
    }

    checkEmail(changeEvent) {
      this.validEmail = /.+@.+\..+/i.test(changeEvent.target.value) && changeEvent.target.value != "";
    }

    onSendFeedback(sendEvent) {
      if (this.validEmail){
        this.onToggleFeedback();
      } else {
        sendEvent.preventDefault();
        Actions.trigger(ActionTypes.CHECK_EMAIL);
      }
    }


    onToggleFeedback() {
        if(!AppStore.isOniPadApp()) {
          this.validEmail = false;
          Actions.trigger(ActionTypes.TOGGLE_FEEDBACK);
          setTimeout(() => {
              AppStore.setFeedbackObject({});
              document.getElementsByClassName("feedback-headline-email")[0].value = ("");
              document.getElementsByClassName("feedback-headline-message")[0].value = ("");
          }, 1000);
        } else {
          alert("Giving feedback is not possible on the iPad App!");
        }
    }

 }
