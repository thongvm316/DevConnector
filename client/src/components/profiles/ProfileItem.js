import React from 'react';
import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';

const ProfileItem = (props) => {
  const {
    profile: {
      user: { _id, name, avatar },
      status,
      company,
      location,
      skills,
    },
  } = props;
  return (
    <div className='profile bg-lisht'>
      <img src={avatar} alt='' className='round-img' />
      <div>
        <h2>{name}</h2>
        <p>
          {status} {company && <span>at {company}</span>}
        </p>
        <p className='my-1'>{location && <span>{location}</span>}</p>
        <Link to={`/profile/${_id}`} className='btn btn-primary'>
          View Profile
        </Link>
      </div>
      <ul>
        {skills.map((skill, index) => (
          <li key={index} className='text-primary'>
            <i className='fas fa-check'>{skill}</i>
          </li>
        ))}
      </ul>
    </div>
  );
};

ProfileItem.propTypes = {};

export default ProfileItem;
