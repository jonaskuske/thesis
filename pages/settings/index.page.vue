<script setup lang="ts"></script>

<template>
  <div class="heading">
    <a href="/">
      <svg
        width="32"
        height="33"
        viewBox="0 0 32 33"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 27.1667L5.33331 16.5L16 5.83337L17.9 7.70004L10.4333 15.1667H26.6666V17.8334H10.4333L17.9 25.3L16 27.1667Z"
          fill="white"
        />
      </svg>
    </a>
    <h1>Einstellungen</h1>
  </div>
  <h2>Account</h2>
  <div class="card">
    <p>
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_112_331)">
          <path
            d="M6 1C3.24 1 1 3.24 1 6C1 8.76 3.24 11 6 11H8.5V10H6C3.83 10 2 8.17 2 6C2 3.83 3.83 2 6 2C8.17 2 10 3.83 10 6V6.715C10 7.11 9.645 7.5 9.25 7.5C8.855 7.5 8.5 7.11 8.5 6.715V6C8.5 4.62 7.38 3.5 6 3.5C4.62 3.5 3.5 4.62 3.5 6C3.5 7.38 4.62 8.5 6 8.5C6.69 8.5 7.32 8.22 7.77 7.765C8.095 8.21 8.655 8.5 9.25 8.5C10.235 8.5 11 7.7 11 6.715V6C11 3.24 8.76 1 6 1ZM6 7.5C5.17 7.5 4.5 6.83 4.5 6C4.5 5.17 5.17 4.5 6 4.5C6.83 4.5 7.5 5.17 7.5 6C7.5 6.83 6.83 7.5 6 7.5Z"
            fill="white"
          />
        </g>
        <defs>
          <clipPath id="clip0_112_331">
            <rect width="12" height="12" fill="white" />
          </clipPath>
        </defs>
      </svg>
      martha.buchbinder@gmail.com
    </p>
    <h2>
      <svg
        width="24"
        height="25"
        viewBox="0 0 24 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_110_314)">
          <path
            d="M12 12.5C14.21 12.5 16 10.71 16 8.5C16 6.29 14.21 4.5 12 4.5C9.79 4.5 8 6.29 8 8.5C8 10.71 9.79 12.5 12 12.5ZM12 14.5C9.33 14.5 4 15.84 4 18.5V20.5H20V18.5C20 15.84 14.67 14.5 12 14.5Z"
            fill="white"
          />
        </g>
        <defs>
          <clipPath id="clip0_110_314">
            <rect width="24" height="24" fill="white" transform="translate(0 0.5)" />
          </clipPath>
        </defs>
      </svg>
      Martha Buchbinder
    </h2>
    <h2>
      <svg
        width="24"
        height="25"
        viewBox="0 0 24 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_110_317)">
          <path
            d="M12.65 10.5C11.83 8.17 9.61 6.5 7 6.5C3.69 6.5 1 9.19 1 12.5C1 15.81 3.69 18.5 7 18.5C9.61 18.5 11.83 16.83 12.65 14.5H17V18.5H21V14.5H23V10.5H12.65ZM7 14.5C5.9 14.5 5 13.6 5 12.5C5 11.4 5.9 10.5 7 10.5C8.1 10.5 9 11.4 9 12.5C9 13.6 8.1 14.5 7 14.5Z"
            fill="white"
          />
        </g>
        <defs>
          <clipPath id="clip0_110_317">
            <rect width="24" height="24" fill="white" transform="translate(0 0.5)" />
          </clipPath>
        </defs>
      </svg>
      **************
    </h2>
    <div><a href="#">Abmelden</a> <a href="#">Passwort ändern</a></div>
  </div>
  <h2>Standort</h2>
  <label for="gps">GPS-Standortdaten verwenden</label>
  <h2>Mitteilungen</h2>
  <label for="notifications">Mitteilungen erlauben</label>
  <label for="notification-time">Erinnerung an Sichtung</label>
</template>

<style scoped>
.card {
  background: rgba(108, 91, 216, 0.2);
  box-shadow: 0px 0px 6px 2px rgba(164, 164, 164, 0.25);
  border-radius: 8px;
  padding: 24px;
}
.card a {
  color: #d9d2ff;
}
a {
  display: inline-block;
  vertical-align: bottom;
}
a svg {
  display: inline-block;
}
h1 {
  display: inline-block;
  margin-block: 0;
}
label {
  margin-block-start: 16px;
}
</style>
