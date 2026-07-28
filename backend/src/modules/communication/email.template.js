// src/modules/communication/email.template.js

/* =========================================
   BASE TEMPLATE
========================================= */

const wrapTemplate = ({
  title,
  content,
}) => {
  return `
  <div style="
    max-width:600px;
    margin:auto;
    padding:20px;
    font-family:sans-serif;
    background:#ffffff;
    border-radius:10px;
    border:1px solid #e5e7eb;
  ">
    <h2 style="color:#111827;">
      ${title}
    </h2>

    <div style="
      color:#374151;
      line-height:1.6;
    ">
      ${content}
    </div>

    <hr style="margin:20px 0;" />

    <p style="
      font-size:12px;
      color:#9ca3af;
    ">
      This is an automated message.
    </p>
  </div>
  `;
};

/* =========================================
   OTP EMAIL
========================================= */

const otpEmailTemplate =
  ({
    code,
    title,
  }) => {
    return wrapTemplate({
      title,

      content: `
        <p>
          Your verification code is:
        </p>

        <h1 style="
          letter-spacing:6px;
          font-size:36px;
        ">
          ${code}
        </h1>

        <p>
          This code expires in 5 minutes.
        </p>

        <p>
          Do not share this code with anyone.
        </p>
      `,
    });
  };

/* =========================================
   PASSWORD RESET EMAIL
========================================= */

const passwordResetTemplate =
  ({
    code,
  }) => {
    return wrapTemplate({
      title:
        "Password Reset",

      content: `
        <p>
          Use the code below to reset your password:
        </p>

        <h1 style="
          letter-spacing:6px;
          font-size:36px;
        ">
          ${code}
        </h1>

        <p>
          This code expires in 5 minutes.
        </p>
      `,
    });
  };

/* =========================================
   LOGIN ALERT EMAIL
========================================= */

const loginAlertTemplate =
  ({
    device,
    ipAddress,
  }) => {
    return wrapTemplate({
      title:
        "New Login Alert",

      content: `
        <p>
          We detected a new login to your account.
        </p>

        <ul>
          <li>
            Device: ${device}
          </li>

          <li>
            IP Address: ${ipAddress}
          </li>
        </ul>

        <p>
          If this wasn't you, please reset your password immediately.
        </p>
      `,
    });
  };

module.exports = {
  otpEmailTemplate,
  passwordResetTemplate,
  loginAlertTemplate,
};