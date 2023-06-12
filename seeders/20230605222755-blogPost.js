"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "BlogPosts",
      [
        {
          title: "Healthy and Delicious Smoothie Recipes",
          content:
            "Smoothies are a fantastic way to nourish your body with essential nutrients while enjoying a delicious treat. In this blog post, we will share some of our favorite smoothie recipes that are not only healthy but also bursting with flavor. From refreshing tropical blends to creamy berry concoctions, these recipes will satisfy your taste buds and keep you energized throughout the day. So dust off your blender and let's blend some goodness!",
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "The Art of Gardening",
          content:
            "Gardening is a wonderful hobby that allows you to connect with nature and create something beautiful. Whether you have a small balcony or a spacious backyard, gardening offers endless possibilities. In this blog post, we will explore the basics of gardening, including choosing the right plants, preparing the soil, and maintaining a healthy garden. So grab your gardening tools and let's get started!",
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
