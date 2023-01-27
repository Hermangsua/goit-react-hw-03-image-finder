import { Component } from 'react';
import { Searchbar } from './SearchBar/SearchBar';
import { fetchImages } from './Api/fetch';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';
import React from 'react';
import { createRef } from 'react';

export class App extends Component {
  state = {
    images: [],
    isLoading: false,
    currentSearch: '',
    pageNr: 1,
    modalOpen: false,
    modalImg: '',
    modalAlt: '',
  };

  imagesRef = createRef();

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });
    const inputForSearch = event.target.elements.inputForSearch;
    if (inputForSearch.value.trim() === '') {
      this.setState({ isLoading: false });
      return;
    }
    const response = await fetchImages(inputForSearch.value, 1);
    this.setState({
      images: response,
      isLoading: false,
      currentSearch: inputForSearch.value,
      pageNr: 1,
    });
  };

  handleClickMore = async () => {
    const response = await fetchImages(
      this.state.currentSearch,
      this.state.pageNr + 1
    );
    this.setState({
      images: [...this.state.images, ...response],
      pageNr: this.state.pageNr + 1,
    });
  };

  handleImageClick = event => {
    this.setState({
      modalOpen: true,
      modalAlt: event.target.alt,
      modalImg: event.target.name,
    });
  };

  handleModalClose = () => {
    this.setState({
      modalOpen: false,
      modalImg: '',
      modalAlt: '',
    });
  };

  handleKeyDown = event => {
    if (event.code === 'Escape') {
      this.handleModalClose();
    }
  };

  async componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  getSnapshotBeforeUpdate(_, prevState) {
    if (prevState.images.length !== this.state.images.length) {
      return this.imagesRef.current?.scrollHeight ?? null;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (snapShot) {
      window.scrollTo({ top: snapShot, behavior: 'smooth' });
    }
  }
  render() {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gridGap: '16px',
          paddingBottom: '24px',
        }}
      >
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <React.Fragment>
            <Searchbar onSubmit={this.handleSubmit} />

            <ImageGallery
              ref={this.imagesRef}
              onImageClick={this.handleImageClick}
              images={this.state.images}
            />

            {this.state.images.length > 0 ? (
              <Button onClick={this.handleClickMore} />
            ) : null}
          </React.Fragment>
        )}
        {this.state.modalOpen ? (
          <Modal
            src={this.state.modalImg}
            alt={this.state.modalAlt}
            handleClose={this.handleModalClose}
          />
        ) : null}
      </div>
    );
  }
}
