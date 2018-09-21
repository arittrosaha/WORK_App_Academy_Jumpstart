# Array is a data structure

def get_avg (num1, num2, num3)
  sum = num1 + num2 + num3

  return sum / 3.0
end

# puts get_avg(2,3,4)

nums = [1,2,3,4,5]
# puts nums # => 1, 2, 3, 4, 5
# print nums # => [1,2,3,4,5]
# p nums # => [1,2,3,4,5]

# puts nums.length

arr = ["jumpstart", 5, false, [1]]
# p arr


arr = [[[["hello"]]]]
# puts arr.length
# p arr[0] # => [[["hello"]]]
# p arr[0][0] # => [["hello"]]
# p arr[0][0][0] # => ["hello"]
# p arr[0][0][0][0] # => "hello"
# p arr[0][0][0][0][0] # => "h"

# Shovel operator (<<)
states = ["New York", "California", "Washington"]
# p states
states << "Texas"
# p states
states << "Maine"
# p states
states.push("New Jersey", "Florida")
# p states

# p states
states[2] = "Nevada"
# p states

i = 0
while i < states.length
  puts states[i] + " Starts with " + states[i][0]
  i += 1
end

def get_avg (arr)
  sum = 0

  i = 0
  while i < arr.length
    sum += arr[i]

    i += 1
  end
  # return sum / arr.length * 1.0 # => 5.0 because of order-of-operation
  return sum / (arr.length * 1.0)
end

# puts get_avg([1,2,3,4,5,6,7,8,9,10]) # => 5.0

def get_even (nums)
  evens = []
  i = 0
  while i < nums.length
    if nums[i] % 2 == 0
      evens << nums[i]
    end

    i += 1
  end
  # return evens
end

# p get_even([1,2,3,4,5,6,7,8,9,10])
