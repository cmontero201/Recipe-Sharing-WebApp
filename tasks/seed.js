const dbConnection = require("../data/connection")
const users = require("../data/users")
const posts = require("../data/posts")
const likes = require("../data/likes")

async function main() {
  const db = await dbConnection();

  await db.dropDatabase();

  //password1
  const me = await users.create("cmont", "Christian", "Montero", "cmontero@bu.edu", "$2y$16$pWqVsqG7uKMVk4GBFs2bBevYUZ3uTvxWplhx28rzbxzz5c8tG6rCW", "")
  const id = me._id;

  //password2
  const me2 = await users.create("aaa", "Jimmy", "Carter", "aaa1@stevens.edu", "$2y$16$hBQ4HogLMinrfyrTO8C/r.psu6vx24ovghGjWuyBuqqKoeSwFpyIq", "I am a married father of 3 who enjoys gardening, nature, wine tasting, cooking, and spending lots of time with family and friends.")
  const id2 = me2._id

  //password3
  const me3 = await users.create("bbb", "Eric", "Baker", "bbb2@aol.com", "$2y$16$vTJI3L68TsrlqH98.ZRUz.tOkiJh1scymFU8XXxMCuFQ.tLMT9MYm", "I love to cook and bake. It truly is a passion of mine. I love trying all kinds of new recipes. Variety is the spice of life. My family and friends love my cooking and I love to cook for them.")
  const id3 = me3._id

  //password4
  const me4 = await users.create("ccc", "Lucy", "Doe", "ccc3@gamil.com", "$2y$16$xAf9q8ozjbylP5Lvw/b1MORl0UiXNGKtQ0VNUmGosoq28T1ugjXYe", "I have a love for cooking that I got from the great cooks in my life, my Mother Marilyn, my step-mother Joanie and Grannie Jones. Boy can these women cook! My Dad Jerry was always the grill master at our house.")
  const id4 = me4._id

  //password5
  const me5= await users.create("ddd", "Sherry", "Jones", "ddd4@yahoo.com", "$2y$16$m8r/Z0vKJX/MwMF1e/FAau.Z6olWqE6Rrf3MW49/ho51MM8rFESv2", "I love cooking and I have been testing recipes on my husband and son for a few years now. My husband says, 'practice makes perfect' because he has been much happier with my cooking latley, compared to when we were first married.")
  const id5 = me5._id


  const firstPost = await posts.createPost(
    id, 
    "Grilled Salmon Sandwiches", 
    "Ina Garten builds her sandwiches high by stacking a bed of mesclun greens and a thick cut of grilled salmon between two brioche buns. For a creamy finish, coat each side of the bun with her homemade sour cream-dill sauce.", 
    "2 pounds fresh salmon fillets \nGood olive oil \n1 cup good mayonnaise \n1/4 cup sour cream \n3/4 teaspoon white wine vinegar \n12 fresh basil leaves \n3/4 cup chopped fresh dill \n1 1/2 tablespoons chopped scallions, (white and green parts) \n1/4 teaspoon kosher salt \n1/4 teaspoon freshly ground black pepper \n3 teaspoons capers, drained",
    "For the salmon, heat coals in an outdoor grill and brush the top of the grill with oil. Rub the outside of the salmon with olive oil, salt, and pepper, to taste. Grill for 5 minutes on each side, or until the salmon is almost cooked through. Remove to a plate and allow it to rest for 15 minutes. \nFor the sauce, place the mayonnaise, sour cream, vinegar, basil, dill, scallions, salt, and pepper in the bowl of a food processor fitted with a steel blade. Process until combined. Add the capers and pulse 2 or 3 times. \nTo assemble the sandwiches, slice the rolls in 1/2 crosswise. Spread a tablespoon of sauce on each cut side. On the bottom 1/2, place some mesclun salad and then a piece of salmon. Place the top of the roll on the salmon and serve immediately."
  );
  console.log("1")
  const secondPost = await posts.createPost(
    id2, 
    "Key Lime Pie", 
    "This recipe uses condensed milk and sour cream. A summertime favorite!", 
    "3/4 Cup Key Lime Juice \n1 Tbsp Lime Zest \n1/2 Cup Sour Cream \n3 Cups Sweetened Condensed Milk \n1 9in Graham Cracker Crust",
    "Preheat oven to 350 degrees F (175 degrees C). \nIn a medium bowl, combine condensed milk, sour cream, lime juice, and lime rind. Mix well and pour into graham cracker crust. \nBake in preheated oven for 5 to 8 minutes, until tiny pinhole bubbles burst on the surface of pie. DO NOT BROWN! \nChill pie thoroughly before serving. Garnish with lime slices and whipped cream if desired."
  );
  const thirdPost = await posts.createPost(
    id2, 
    "Iron Chef Marc Forgione's Grilled Chicken Breast With Marinated Cherry Tomato Salad",
    "This is a great summertime dish as tomatoes are at their peak during the summer,' says Marc. 'Serve with some crusty bread to soak up any leftover cherry tomatoes.'", 
    "2 teaspoons coriander seeds \n2 cups heirloom cherry tomatoes \n1/4 red onion, thinly sliced \n5 tablespoons extra-virgin olive oil \n2 tablespoons fresh ginger juice \n2 tablespoons fresh basil leaves, thinly sliced \n1 tablespoon fresh mint leaves, thinly sliced \n1 tablespoon sherry vinegar \n1 clove garlic, minced \n2 boneless, skinless chicken breasts",
    "For the marinated cherry tomatoes: Toast the coriander seeds in a small skillet over medium heat until fragrant, 3 to 5 minutes. Transfer to a mortar and pestle and crack. Allow to cool. \nBring a medium pot of water to a boil. Make a small 'x' incision at the bottom of each tomato. Blanch the cherry tomatoes for 1 minute and immediately transfer them to a large bowl filled with ice water (an ice bath). Allow the tomatoes to cool, and then peel the tomatoes and discard the skins. \nIn a medium bowl, mix together the coriander, peeled tomatoes, onions, olive oil, ginger juice, basil, mint, vinegar, and garlic. Season with salt and pepper, cover, and allow the tomato mixture to sit at room temperature for 4 hours. \nFor the chicken: Combine the olive oil, basil and garlic in a large bowl. Add the chicken breasts, making sure to coat all sides with the marinade. Cover and let marinate for at least 2 hours in the refrigerator. \nPreheat the grill to medium heat. Remove the chicken from the marinade and pat dry with a towel. Sprinkle with salt and pepper. Add chicken breasts and grill for around 5 minutes on each side, depending on how hot your grill is, or until cooked through."
  );
  const fourth = await posts.createPost(
    id3, 
    "Giada's Grilled Chicken With Spinach and Pine Nut Pesto",
    "Simply grilled chicken is the perfect platform for all of the bright, fresh flavors in this dish: Giada covers each piece with a zesty spread of spinach and pine nut pesto before serving.", 
    "2 boneless chicken breasts \n2 cups lightly packed baby spinach leaves (about 2 ounces) \n1/4 cup pine nuts, toasted \n2 tablespoons fresh lemon juice \n1 to 2 teaspoons grated lemon peel \n1/3 cup plus 2 teaspoons olive oil \nSalt and freshly ground black pepper \n1/3 cup freshly grated Parmesan",
    "Heat a grill pan on medium high heat. Lightly oil the grill pan. Sprinkle the chicken with salt and pepper. Grill the chicken until cooked through, about 5 minutes per side. \nCombine the spinach, pine nuts, lemon juice, and lemon peel in a processor. Lightly pulse. With the machine running, gradually add 1/3 cup of the oil, blending until the mixture is creamy. Add salt and pulse. Put half of the pesto into ice cube trays and store in the freezer for future use. \nTransfer the rest of the spinach mixture to a medium bowl. Stir in the Parmesan. Season the pesto with salt and pepper, to taste.",
    "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2011/4/12/0/FN_Grilled-Chicken-Spinach-Pesto_s4x3.jpg.rend.hgtvcom.966.725.suffix/1371597359023.jpeg"
  );
  const fifth = await posts.createPost(
    id3, 
    "THIS IS THE fifth!!!",
    "This recipe uses condensed milk and sour cream. A summertime favorite!", 
    "3/4 Cup Key Lime Juice \n1 Tbsp Lime Zest \n1/2 Cup Sour Cream \n3 Cups Sweetened Condensed Milk \n1 9in Graham Cracker Crust",
    "Preheat"
  );

  const sixth = await posts.createPost(
    id4, 
    "THIS IS THE sixth!!!",
    "This recipe uses condensed milk and sour cream. A summertime favorite!", 
    "3/4 Cup Key Lime Juice \n1 Tbsp Lime Zest \n1/2 Cup Sour Cream \n3 Cups Sweetened Condensed Milk \n1 9in Graham Cracker Crust",
    "Preheat"
  );

  const seventh = await posts.createPost(
    id4, 
    "THIS IS THE seventh!!!",
    "This recipe uses condensed milk and sour cream. A summertime favorite!", 
    "3/4 Cup Key Lime Juice \n1 Tbsp Lime Zest \n1/2 Cup Sour Cream \n3 Cups Sweetened Condensed Milk \n1 9in Graham Cracker Crust",
    "Preheat"
  );

  const eighth = await posts.createPost(
    id, 
    "THIS IS THE eighth!!!",
    "This recipe uses condensed milk and sour cream. A summertime favorite!", 
    "3/4 Cup Key Lime Juice \n1 Tbsp Lime Zest \n1/2 Cup Sour Cream \n3 Cups Sweetened Condensed Milk \n1 9in Graham Cracker Crust",
    "Preheat"
  );

  const ninth = await posts.createPost(
    id5, 
    "THIS IS THE ninth!!!",
    "This recipe uses condensed milk and sour cream. A summertime favorite!", 
    "3/4 Cup Key Lime Juice \n1 Tbsp Lime Zest \n1/2 Cup Sour Cream \n3 Cups Sweetened Condensed Milk \n1 9in Graham Cracker Crust",
    "Preheat"
  );

  const tenth = await posts.createPost(
    id2, 
    "Billy Bob's Grilled Chicken With Spinach and Pine Nut Pesto",
    "Simply grilled chicken is the perfect platform for all of the bright, fresh flavors in this dish: Giada covers each piece with a zesty spread of spinach and pine nut pesto before serving.", 
    "2 boneless chicken breasts \n2 cups lightly packed baby spinach leaves (about 2 ounces) \n1/4 cup pine nuts, toasted \n2 tablespoons fresh lemon juice \n1 to 2 teaspoons grated lemon peel \n1/3 cup plus 2 teaspoons olive oil \nSalt and freshly ground black pepper \n1/3 cup freshly grated Parmesan",
    "Heat a grill pan on medium high heat. Lightly oil the grill pan. Sprinkle the chicken with salt and pepper. Grill the chicken until cooked through, about 5 minutes per side. \nCombine the spinach, pine nuts, lemon juice, and lemon peel in a processor. Lightly pulse. With the machine running, gradually add 1/3 cup of the oil, blending until the mixture is creamy. Add salt and pulse. Put half of the pesto into ice cube trays and store in the freezer for future use. \nTransfer the rest of the spinach mixture to a medium bowl. Stir in the Parmesan. Season the pesto with salt and pepper, to taste.",
    "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2011/4/12/0/FN_Grilled-Chicken-Spinach-Pesto_s4x3.jpg.rend.hgtvcom.966.725.suffix/1371597359023.jpeg"
  );
  const eleventh = await posts.createPost(
    id5, 
    "Barbeque Salmon Sandwiches", 
    "Dorinda Crocker builds her sandwiches high by stacking a bed of mesclun greens and a thick cut of grilled salmon between two brioche buns. For a creamy finish, coat each side of the bun with her homemade sour cream-dill sauce.", 
    "2 pounds fresh salmon fillets \nGood olive oil \n1 cup good mayonnaise \n1/4 cup sour cream \n3/4 teaspoon white wine vinegar \n12 fresh basil leaves \n3/4 cup chopped fresh dill \n1 1/2 tablespoons chopped scallions, (white and green parts) \n1/4 teaspoon kosher salt \n1/4 teaspoon freshly ground black pepper \n3 teaspoons capers, drained",
    "For the salmon, heat coals in an outdoor grill and brush the top of the grill with oil. Rub the outside of the salmon with olive oil, salt, and pepper, to taste. Grill for 5 minutes on each side, or until the salmon is almost cooked through. Remove to a plate and allow it to rest for 15 minutes. \nFor the sauce, place the mayonnaise, sour cream, vinegar, basil, dill, scallions, salt, and pepper in the bowl of a food processor fitted with a steel blade. Process until combined. Add the capers and pulse 2 or 3 times. \nTo assemble the sandwiches, slice the rolls in 1/2 crosswise. Spread a tablespoon of sauce on each cut side. On the bottom 1/2, place some mesclun salad and then a piece of salmon. Place the top of the roll on the salmon and serve immediately."
  );

  const twelvth = await posts.createPost(
    id3, 
    "The Best Key Lime Pie", 
    "This recipe uses the best darn condensed milk and the creamiest sour cream. A year round favorite!", 
    "3/4 Cup Key Lime Juice \n1 Tbsp Lime Zest \n1/2 Cup Sour Cream \n3 Cups Sweetened Condensed Milk \n1 9in Graham Cracker Crust",
    "Preheat oven to 350 degrees F (175 degrees C). \nIn a medium bowl, combine condensed milk, sour cream, lime juice, and lime rind. Mix well and pour into graham cracker crust. \nBake in preheated oven for 5 to 8 minutes, until tiny pinhole bubbles burst on the surface of pie. DO NOT BROWN! \nChill pie thoroughly before serving. Garnish with lime slices and whipped cream if desired."
  );

  console.log('Done seeding database');
  await db.serverConfig.close();
}

main().catch((error) => {
  console.error(error);
  return dbConnection().then((db) => {
    return db.serverConfig.close();
  });
});