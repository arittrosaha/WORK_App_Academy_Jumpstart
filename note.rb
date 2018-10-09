teachers = ["Arittro", "Cindy", "Chao", "Reef", "Alvin"]
i = 0
while i < teachers.length
#   puts teachers[i]

  i += 1
end

# array.each - itterates through only array

teachers = ["Arittro", "Cindy", "Chao", "Reef", "Alvin"]
teachers.each do |teacher|
#   puts teacher
end

nums = [2,5,6,8,4]
sum = 0

# preffered when we have multiple wthin the block.
nums.each do |num|
  sum += num
end
# p sum

# preffered for only single expression within the block.
nums.each {|num| sum += num}
# p sum

foods = ["pizza", "burgers", "wings", "kale", "pie"]
i = 0 # index
while i < foods.length
  if i % 2 == 0
    # p foods[i].upcase
  else
    # p foods[i]
  end
  i += 1
end

foods.each_with_index do |food, idx| # order between the pipes matter
  if idx % 2 == 0
    # puts food.upcase
  else
    # puts food
  end
end

# Error when the following code is run
# foods.each {|food| if food[0] == "p" puts food.upcase else puts food end}

# string.each_char - itterates through only string
string = "Hello"
string.each_char {|char| # puts char}

# string.each_char.with_index - itterates through string with index
string = "Jumpstart"
string.each_char.with_index do |char, i|
  # puts char
end

# number.times - itterates that number of times
5.times { # puts "hi" }
5.times { |i| # puts i } # => 0 1 2 3 4


# Ranges:

# Write a method that takes in two numbers (a,b) and returns an array of all
# numbers between.
def range(a, b)
  nums = []
  (a..b).each {|num| nums << num}
  return nums
end

# p range(10, 14) # => [10, 11, 12, 13, 14]
# p range(23, 32) # => [23, 24, 25, 26, 27, 28, 29, 30, 31, 32]

# Inclusive (a..b)
(2..9).each {|i| # puts i} # => prints 2 through 9
("b".."y").each {|i| # puts i} # => prints all the alphabets from "b" to "y"

# Exclusive (a...b)
(2...9).each {|i| # puts i} # => prints 2 through 8
(-2...9).each {|i| # puts i} # => prints -2 through 8
(9...2).each {|i| # puts i} # => prints nothing because range is empty
("b"..."y").each {|i| # puts i} # => prints all the alphabets from "b" to "x"


# Nested Loops (double for now):

# Below we generate all pairs of elements with duplicates.
letters = ["Alvin", "Brian", "Cindy", "David"]
letters.each do |letter1|
  letters.each do |letter2|
    # puts letter1 + "  " + letter2
  end
end

# Below we print out only unique pairs of elements by ensuring that idx 2
# is strickly greater than idx1. In other words, idx2 never referes to
# what idx1 did previously
letters = ["Alvin", "Brian", "Cindy", "David"]
letters.each_with_index do |letter1, idx1|
  letters.each_with_index do |letter2, idx2|
    if idx2 > idx1 # prevents from revisiting same index
    # if idx1 < idx2 # same
    # if idx2 < idx1 # same
    # if idx1 < idx2 # same
      # puts letter1 + "  " + letter2
    end
  end
end

# Below is a nested while loops which is not preffered
letters = ["Alvin", "Brian", "Cindy", "David"]
i = 0
while i < letters.length
  j = 0
  while j < letters.length
    # p letters[i] + " " + letters[j]
    j += 1
  end
  i += 1
end


# Nested array (2d array)
arr = [
  ["a", "b", "c"],
  ["d", "e"],
  ["f", "g", "h"]
]
# p arr # => [["a", "b", "c"], ["d", "e"], ["f", "g", "h"]]
# p arr[1] # => ["d", "e"]
# p arr.length # => 3 or total number of sub arrays (elements) in arr.
subarr = arr[1] # ["d", "e"]
# p subarr[0] # => "d"
# p arr[1][0] # => "d"
# p arr[2][1] # => "g"

# Some practical use cases: Tic, Tac, Toe, Battleship, Chess

# Itterates through a 2d array:
arr = [
  ["a", "b", "c"],
  ["d", "e"],
  ["f", "g", "h"]
]
arr.each do |sub_array|
  # p sub_array
  sub_array.each do |letter|
    # p letter
  end
end
