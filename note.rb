# PROBLEM 1
# Write a method `contains_pair_product?` that takes in an array and a target number.
# The method should return a boolean indicating whether or not a pair of elements of the
# array multiply together to result in the target.

def contains_pair_product?(arr, target)
    if arr.length < 2
        return false
    end 

    arr.each_with_index do |ele1, i1|
        arr.each_with_index do |ele2, i2|
            if i1 > i2 && ele1 * ele2 == target
                return true
            end
        end
    end

    return false
end

# puts contains_pair_product?([1, 4, 3, 2], 8)      #=> true
# puts contains_pair_product?([7, 5, 2, 4, 12], 12) #=> false
# puts contains_pair_product?([2], 4)               #=> false

# PROBLEM 2
# A perfect number is a number that is equal to the sum of 
# its divisors (excluding the number itself).
#
# For example...
#
# 6 is a perfect number because 1 + 2 + 3 = 6
# 28 is a perfect number because 1 + 2 + 4 + 7 + 14 = 28
#
# Write a method `perfect_numbers` that takes in a number n. 
# The method should return an array containing the first n perfect numbers.

def perfect_numbers(num)
    arr = []
    i = 1
    while arr.length < num
        if per_num?(i)
            arr << i
        end
        i += 1
    end
    return arr
end

def per_num? (n)
    sum = 0
    (1...n).each do |x|
        if n % x == 0
            sum += x
        end
    end
    return sum == n
end

# def perfect_number?(num)
#   sum = 0

#   (1...num).each do |i|
#     if num % i == 0
#       sum += i
#     end
#   end

#   return sum == num
# end

# def perfect_numbers(n)
#   perfect_nums = []

#   i = 1
#   while perfect_nums.length < n
#     if perfect_number?(i)
#       perfect_nums << i
#     end

#     i += 1
#   end

#   return perfect_nums
# end

# print perfect_numbers(2) #=> [6, 28]
# puts
# print perfect_numbers(3) #=> [6, 28, 496]
# puts

# PROBLEM 3
# Aba is a German children's game where secret messages are exchanged.
# In Aba, after every vowel we add "b" and add that same vowel.
#
# Here are examples:
#
# cats -> cabats
# dogs -> dobogs
# Afrika -> Abafribikaba
#
# Write a method `aba_translate` that takes in a sentence string and returns
# a new sentence representing its Aba translation. 
# Capitalized words of the original sentence should be properly
# capitalized in the new sentence.

def aba_translate(sent)
    result = ""
    vowels = "aeiou"

    sent.each_char do |char|
        result += char
        if vowels.include?(char.downcase)
            result += "b" + char.downcase
        end
    end

    return result./
end

# def aba_translate(sent)
#   new_sent = ""
#   vowels = "aeiou"
#   sent.each_char do |char|
#     if vowels.include?(char.downcase)
# 	  new_sent += char + "b" + char.downcase
# 	else
# 	  new_sent += char
# 	end
#   end
#   return new_sent
# end

puts aba_translate("Cats and dogs") #=> "Cabats aband dobogs"
puts aba_translate("Everyone can code") #=> "Ebeveberyobonebe caban cobodebe"
puts aba_translate("Africa is Afrika in German") #=> "Abafribicaba ibis Abafribikaba ibin Gebermaban"