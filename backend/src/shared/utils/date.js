// src/shared/utils/date.js

/* =========================================
   DATE HELPERS
========================================= */

const now = () =>
  new Date();

const addMinutes = (
  minutes = 0
) => {
  return new Date(
    Date.now() +
      minutes *
        60 *
        1000
  );
};

const addHours = (
  hours = 0
) => {
  return new Date(
    Date.now() +
      hours *
        60 *
        60 *
        1000
  );
};

const addDays = (
  days = 0
) => {
  return new Date(
    Date.now() +
      days *
        24 *
        60 *
        60 *
        1000
  );
};

const isExpired = (
  date
) => {
  return (
    new Date(date) <
    new Date()
  );
};

const formatDate = (
  date
) => {
  return new Date(
    date
  ).toISOString();
};

const diffInMinutes =
  (
    startDate,
    endDate
  ) => {
    const diff =
      new Date(
        endDate
      ) -
      new Date(
        startDate
      );

    return Math.floor(
      diff /
        (1000 * 60)
    );
  };

module.exports = {
  now,
  addMinutes,
  addHours,
  addDays,
  isExpired,
  formatDate,
  diffInMinutes,
};