import './checkbox.sass'

import React from 'react';
import uuidV4 from 'uuid/v4';

export default function Checkbox (props) {
  const uid = uuidV4().substring(0, 18).replace(/-/g, '');
  return (
    <section className='checkbox'>
      <div className='checkbox__container'>
        <input id={ 'checkbox__input-' + uid }
          type='checkbox'
          value=''
          name='check'
          disabled={ (props.disabled === true) ? 'disabled' : '' }
          checked={ props.checkstate || false }
          onChange={ props.changeCheckState || (() => {}) }
        />
        <label htmlFor={ 'checkbox__input-' + uid }></label>
      </div>
    </section>
  );
}
