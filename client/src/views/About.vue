<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div id="nav" class="text-success">
          <router-link to="/">Home </router-link>
        </div>
        <h2>About <span id="title">bullUtin</span></h2>
      </div>
    </div>
    <hr />
    <div class="row">
      <div class="col-12 app-summary pr-4 pl-4">
        <p>
          Welcome to bullUtin, an on-line community bulletin board where you can review and/or post items of interest
          in the area immediately surrounding your current location. This application is useful for sharing information
          such as community events, traffic updates, neighborhood watch items and lost and found listings. You
          can filter posts by distance or category. Each post displays a post time and distance from your current
          location.
        </p>
        <p>
          Additionally, each post is classified in one of three categories:
          <ul>
            <li>
              "Suspect" - several other users have refuted the accuracy of the post
            </li>
            <li>
              "Verified" - several users have verified the accuracy of the post
            </li>
            <li>
              "Unverified" - user responses are insufficient or inconclusive
            </li>
          </ul>
          If you have information to confirm or refute a post, select the appropriate icon on the post in order
          to help other users assess reliability of the information.
        </p>
        <p>
          Finally, by clicking the username associated with each post, you may view the user's profile which includes
          their overall reliabliity rating and a link to email the user if needed. You may block users that you deem
          unreliable. The displayed user reliability is based on post history to include volume and accuracy as
          determined by other users. Please note that if your reliabilty drops below 20%, your account could be
          suspended.
        </p>
      </div>
    </div>
  </div>
</template>

<style>
  #title {
    color: #2c3e50;
    font-family: 'Lobster', cursive;
  }

  .app-summary {
    text-align: justify;
  }
</style>