# puts "W2D1"

# Enumerables
# array.each
# string.each_char

# arr = ["Cindy", "Chao", "Reef", "Arittro", "David"]
# i = 0
# while i < arr.length
#   puts arr[i]
#
#   i += 1
# end

arr = [true, 23, "Cindy"]
# arr.each do |element|
#   puts "Hello"
#   puts element
#   puts "GoodBye"
# end

arr = [true, 23, "Cindy"]
# i is automatically getting increased by each
# A do end is a block of code that is getting passed in to each method

# def method(arr)
#   arr.each_with_index do |ele, i| # variable order matters in between the pipes
#     puts i.to_s + "  " + "before"
#     i += 2
#     puts i.to_s + "  " + "after"
#   end
# end
# p method(arr)

# str.each_char do |char|
#   puts char
# end

# {} and do end is different ways to represent a block of code.
# {} is used for one liner codes.
# do end is used for multi line code.

arr = []
# str.each_char { |char| arr << char }
# p arr

# each_with_index is one method
# each_char.with_index is two methods chained together
# Ruby Docs for checking compatibility

# arr = []
# str = "Hello"
# str.each_char.with_index do |char,i|
#   arr << char
#   arr << i
# end
# p arr

# times

# 10.times do |num|
#   p num
#   puts "Hello"
# end

# Ranges

# min cannot be a float
# (min..max) is inclusive
# (50..100).each { |ele| p ele }

# (min...max) is exclusive
# (1...10.2).each do |ele|
#   if ele % 2 == 1
#     p ele
#   end
# end

# Nested Loop

array = [1,2,3,4,5]
new_arr = []
array.each do |ele1|
  # puts "code"
  array.each do |ele2|
    # puts ele1.to_s + " " + ele2.to_s
    new_arr << [ele1,ele2]
  end
  # puts "more coding"
end

# everything from puts code to puts more coding is one iteration for the outer loop.

# elements can have different or similar inheret values and yet they could be different things.
# i.e. 100 at 0 vs 100 at -1
# i.e. one black shirt and another black shirt
# we are comparing the indexes because they will be always unique regardless of the element's value

def unique_pairs(arr)
  result = []

  arr.each_with_index do |ele1, idx1|
    arr.each_with_index do |ele2, idx2|
      # if idx2 > idx1 # idx1 > idx2 or idx2 < idx1 or idx1 < idx2
      #   result << [ele1, ele2]
      # end
      puts ele1 + " " + idx1.
    end
  end

  return result
end

names = ["Chao", "Reef", "Cindy", "Alvin", "David"]
p unique_pairs(names)












#
