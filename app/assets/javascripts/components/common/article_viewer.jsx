import React from 'react';
import OnClickOutside from 'react-onclickoutside';

const ArticleViewer = React.createClass({
  displayName: 'ArticleViweer',

  propTypes: {
    article: React.PropTypes.object.isRequired,
    showButtonLabel: React.PropTypes.string,
    hideButtonLabel: React.PropTypes.string,
    largeButton: React.PropTypes.bool
  },

  getInitialState() {
    return {
      showArticle: false
    };
  },

  showButtonLabel() {
    if (this.props.showButtonLabel) {
      return this.props.showButtonLabel;
    }
    return I18n.t('articles.show_current_version');
  },

  hideButtonLabel() {
    if (this.props.hideButtonLabel) {
      return this.props.hideButtonLabel;
    }
    return I18n.t('articles.hide');
  },

  showArticle() {
    this.setState({ showArticle: true });
    if (!this.state.fetched) {
      this.fetchParsedArticle();
    }
  },

  hideArticle() {
    this.setState({ showArticle: false });
  },

  handleClickOutside() {
    this.hideArticle();
  },

  wikiUrl() {
    return `https://${this.props.article.language}.${this.props.article.project}.org`;
  },

  parsedArticleUrl() {
    const wikiUrl = this.wikiUrl();
    const queryBase = `${wikiUrl}/w/api.php?action=parse&disableeditsection=true&format=json`;
    const articleUrl = `${queryBase}&page=${this.props.article.title}`;

    return articleUrl;
  },

  fetchParsedArticle() {
    $.ajax(
      {
        dataType: 'jsonp',
        url: this.parsedArticleUrl(), // parseUrl,
        success: (data) => {
          this.setState({
            parsedArticle: data.parse.text['*'],
            fetched: true
          });
        }
      });
  },

  render() {
    let button;
    let showButtonStyle;
    if (this.props.largeButton) {
      showButtonStyle = 'button dark';
    } else {
      showButtonStyle = 'button dark small';
    }

    if (this.state.showArticle) {
      button = <button onClick={this.hideArticle} className="button dark small">{this.hideButtonLabel()}</button>;
    } else {
      button = <button onClick={this.showArticle} className={showButtonStyle}>{this.showButtonLabel()}</button>;
    }

    let style = 'hidden';
    if (this.state.showArticle && this.state.fetched) {
      style = '';
    }
    const className = `article-viewer ${style}`;

    let article;
    if (this.state.diff === '') {
      article = '<div />';
    } else {
      // diff = this.state.diff;
      article = this.state.parsedArticle;
    }

    return (
      <div>
        {button}
        <div className={className}>
          <p>
            <a className="button dark small" href={this.props.article.url} target="_blank">{I18n.t('articles.view_on_wiki')}</a>
            {button}
            <a className="pull-right button small" href="/feedback?subject=Article Viewer" target="_blank">How did the article viewer work for you?</a>
          </p>
          <table>
            <thead><tr><th colSpan="4" className="article-header"></th></tr></thead>
            <tbody dangerouslySetInnerHTML={{ __html: article }} />
          </table>
        </div>
      </div>
    );
  }
});

export default OnClickOutside(ArticleViewer);