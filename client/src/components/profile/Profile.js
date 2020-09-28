import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getProfilesById } from '../../action/profile';

const Profile = (props) => {
    console.log(props)
  const {
    getProfilesById,
    profile: { profile, loading },
    auth,
    match,
  } = props;
  console.log(match.params.id)
  useEffect(() => {
    getProfilesById(match.params.id);
  }, [getProfilesById]);
  return <div>Profile</div>;
};

Profile.propTypes = {
  getProfilesById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, { getProfilesById })(Profile);
