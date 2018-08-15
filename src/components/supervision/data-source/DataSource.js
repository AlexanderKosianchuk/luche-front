import React, { Component } from 'react';
import { Translate, I18n } from 'react-redux-i18n';
import styled, { css } from 'react-emotion';

const DEFAULT_DATA_SOURCE_IPS = ['192.168.88.101:2017', '192.168.88.102:2017'];

class DataSource extends Component {
  static form = null;

  constructor(props) {
    super(props);

    this.state = {
      selectedId: 2,
      file: null,
      remoteSources: DEFAULT_DATA_SOURCE_IPS,
      options: [
        {
          id: 1,
          name: I18n.t('supervision.dataSource.KVviaUDP'),
          controller: 'SupervisionExternalUdp',
          aditional: 'remoteSources'
        },
        {
          id: 2,
          name: I18n.t('supervision.dataSource.file'),
          controller: 'SupervisionFile',
          aditional: 'file'
        },
        {
          id: 3,
          name: I18n.t('supervision.dataSource.fileViaUDP'),
          controller: 'SupervisionFileViaUdp',
          aditional: 'file'
        },
        {
          id: 4,
          name: I18n.t('supervision.dataSource.fakeData'),
          controller: 'SupervisionFakeData'
        }
      ]
    }

    if (this.props.dataSource && this.props.dataSource.get) {
      this.props.dataSource.get = this.getDataSource.bind(this);
    }
  }

  getDataSource() {
    let source =  this.state.options.find(
      (option) => { return  option.id === this.state.selectedId }
    );

    if (source.aditional && this.state[source.aditional]) {
      source[source.aditional] = this.state[source.aditional];
    }

    return source;
  }

  handleChange(index, event) {
    let sources = this.state.sources.slice();
    sources[index] = event.target.value;

    this.setState({ sources: sources });
  }

  handleAddSourceClick (event) {
    event.preventDefault();

    let sources = this.state.sources.slice();
    sources.push('');

    this.setState({ sources: sources });
  }

  handleSelectChange (event){
    this.setState({ selectedId: parseInt(event.target.value) });
  }

  handleFileChange(event) {
    this.setState({ file: event.target.files[0] });
  }

  buildSourceIps(option) {
    if (!option || !Array.isArray(option.sources)) {
      return null;
    }

    return (
      <div>
        <div className={ Label }>
          <Translate value='supervision.dataSource.sourceIps'/>
        </div>
        <div>
          {
            option.sources.map((source, index) => {
              return (
                <input
                  key={ index }
                  className='form-control'
                  disabled={ this.props.sessionStarted ? 'disabled' : '' }
                  name='ip[]'
                  value={ source }
                  onChange={ this.handleChange.bind(this, index) }
                />
              );
            })
          }
        </div>
        <div>
          <button
            className='btn btn-default'
            disabled={ this.props.sessionStarted ? 'disabled' : '' }
            onClick={ this.handleAddSourceClick.bind(this) }
          >
            <Translate value='supervision.dataSource.addSource'/>
          </button>
        </div>
      </div>
    );
  }

  buildFileInput(value) {
    return (
      <label className={ ButtonFile + ' btn btn-default'}>
        { this.state.file ? this.state.file.name : I18n.t('supervision.dataSource.chooseFile') }
        <input type='file' onChange={ this.handleFileChange.bind(this) } />
      </label>
    );
  }

  render() {
    return (
      <StyledDiv>
        <div className={ Label }>
          <Translate value='supervision.dataSource.connectionType'/>
        </div>
        <div className={ Control }>
          <select
            className='form-control'
            disabled={ this.props.sessionStarted ? 'disabled' : '' }
            name='connectionType'
            onChange={ this.handleSelectChange.bind(this) }
            value={ this.state.selectedId }
          >
            {
              this.state.options.map((option, index) => {
                return (
                  <option
                    key={ index }
                    value={ option.id }
                  >
                    { option.name }
                  </option>
                );
              })
            }
          </select>
        </div>
        <div className={ Control }>
          {
            (() => {
              switch(this.state.selectedId) {
                case 1:
                  return this.buildSourceIps(
                    this.state.options.find((option) => option.id === this.state.selectedId)
                  );
                  break;
                case 2:
                  return this.buildFileInput();
                  break;
                default:
                  return null;
                  break;
              }
            }).call(this)
          }
        </div>
      </StyledDiv>
    );
  }
}

const StyledDiv = styled('div')`
  padding: 5px 10px;
  text-align: center;
`

const Label = css`
  padding: 5px;
`

const Control = css`
  padding: 5px 0;
  width: 100%;
`

const ButtonFile = css`
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;

  input[type=file] {
    position: absolute;
    top: 0;
    right: 0;
    min-width: 100%;
    min-height: 100%;
    font-size: 100px;
    text-align: right;
    filter: alpha(opacity=0);
    opacity: 0;
    outline: none;
    background: white;
    cursor: inherit;
    display: none;
  }
`

export default DataSource;
