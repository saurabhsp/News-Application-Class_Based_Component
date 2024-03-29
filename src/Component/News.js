import React, { Component } from "react";
import NewsItem from "../NewsItem";
import { Spinner } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import PropTypes from "prop-types";
// import Spinner from "./Spinner";

export class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: 12,
    category: "general",
    apikey: "9db0fdcb56e34407864da5fcdbabac38",
    
  };
  
  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
    apiKey: PropTypes.string.isRequired, // Make apiKey a required prop
  };
  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: true,
      page: 1, // initial page
      totalResults: 0,
    };
    document.title = `${this.capitalizeFirstLetter(
      this.props.category
    )} - News-Monkey`;
  }

  async updateNews() {
    this.props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=9db0fdcb56e34407864da5fcdbabac38&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    this.props.setProgress(40);
    let parsedData = await data.json();
    this.props.setProgress(70);
    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading: false,
    });
    this.props.setProgress(100);
  }

  async componentDidMount() {
    this.updateNews();
  }

  handlePreviousClick = async () => {
    console.log("Previous");
    this.setState({ page: this.state.page - 1 });
    this.updateNews();
  };

  handleNextClick = async () => {
    console.log("Next");
    this.setState({ page: this.state.page + 1 });
    this.updateNews();
  };

  fetchMoreData = async () => {
    this.setState({ page: this.state.page + 1 });
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=9db0fdcb56e34407864da5fcdbabac38&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({
      articles: this.state.articles.concat(parsedData.articles),
      totalResults: parsedData.totalResults,
    });
  };

  render() {
    console.log("render");
    return (
      <>
        <h1
          className="text-center"
          style={{ color: "#6b8900", margin: "35px" }}
        >
          NewsMonkey- Top headlines of{" "}
          {this.capitalizeFirstLetter(this.props.category)}
        </h1>{" "}
        
        {/* {this.state.loading && (
          <div className="text-center">
            {<Spinner style={{ color: "#6b8900" }} />
            }
          </div>
        )} */}
      
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={
            <div className="text-center my-3">
              <Spinner style={{ color: "#6b8900" }} />
            </div>
          }
          style={{ overflowY: "hidden" }} //thankyou this save me from vertically scrollbar shaking
        >
          <div className="container">
            <div className="row">
              {this.state.articles.map((element) => {
                return (
                  <div
                    className="col-12 col-md-6 col-lg-3 mb-3"
                    key={element.url}
                  >
                    <NewsItem
                      title={element.title ? element.title.slice(0, 45) : ""}
                      description={
                        element.description
                          ? element.description.slice(0, 88)
                          : ""
                      }
                      Imageurl={element.urlToImage ? element.urlToImage : ""}
                      newsurl={element.url}
                      author={element.author}
                      date={element.publishedAt}
                      source={element.source.name}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </InfiniteScroll>
      </>
    );
  }
}

export default News;
