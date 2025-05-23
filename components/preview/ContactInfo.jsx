import React, {  } from "react";

const ContactInfo = ({ mainclass, linkclass, teldata, emailData, addressData, telIcon, emailIcon, addressIcon }) => {
    return (
      <div className={mainclass}>
        <a className={linkclass}
          aria-label="Phone Number"
          href={`tel:${teldata}`}>
          {telIcon}  {teldata}
        </a>
        <a className={linkclass}
          aria-label="Email Address"
          href={`mailto:${emailData}`}>
          {emailIcon} {emailData}
        </a>
        <address
          aria-label="Address"
          className={linkclass + " not-italic"} >
          {addressIcon} {addressData}
        </address>
      </div>
    );
  }

export default ContactInfo;