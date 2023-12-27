# As claimed by author it is "lifting technique". I'm not sure if the wiki link is relavant.
# ref: https://www.reddit.com/r/adventofcode/comments/18pnycy/comment/kezzg06/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
# ref: https://topaz.github.io/paste/#XQAAAQAABAAAAAAAAAA4HQqrqKsDwrseA5z2cAuzgh4Js+dLlhtIuwUfa5TAX7Acw5aeAodbeb4ndIq42/UyHc0yWt2oe0id5YSAA5E5evsddtombrGkN43QNYsAiJp1JNsMcFJPyUdXVuM1/nidsU3wqAjTM1wTxobzGzTtnR31pjyTKOps7tV71H5c7n3Zvl6l9UPqqJjlzJ7wur5yJRMyzDNBZd7/t/eROyx61WmWSfloacwB9EJSH91N9DLgTeMzUzfk7RJlS7BtoYT1CpWcyQEfUXHme3aN4i8Fk0ItUKDQMxA1ZTr32IErrS0UtdxGH29K+SR7g0+UDxN9+jkct+8msBNJIbxmsL27tOzYtuY/4Y2zqtlBMYk3FgR3u+kkwXKFAxGdt6DftiLCddLLwkp9jPNYOwy9VEjbeGADoRmmOOeA8mnzXVSDrx+0m5TFl1bA+LKpCy3e4qHwcF8WTrOiF4z2l/1KntqvkvJl53bB29KwIPc6SH0I7zRiRDjjMsdhyITdBzNC2rfB2GgOTcrW0mcNR1bPxT7VOvG8iVoYkWgY3DCQhk9a2zbsG5mNQRNHzjfS4b9E6XxlNQfj/knEWgmbsoFjOcfF5bicE1ruBLKNCMC+pCV1uIjoRLjzIhan5bak4iX+fBy0OrigmHaVLS0z3HmroYX4jv+xKohi
# wiki: https://en.wikipedia.org/wiki/Lifting_theory

from collections import deque

def do_part(part_number=1, use_test=False, day=8):
    if use_test:
        input_name="input/test_input.txt"
    else:
        input_name=f"input/day{day}.txt"
    with open(input_name) as f:
        input=f.read()
    if part_number==1:
        answer=part_1_method(input)
    else:
        answer=part_2_method(input)
    print(f"Day {day} part {part_number} answer is: {answer}")

def part_1_method(input):
    lines=input.split("\n")
    particles=[line_to_particle(line) for line in lines]
    particles=[trim_to_two_coord(particle) for particle in particles]
    total_answer=0
    for n, particle1 in enumerate(particles):
        for m, particle2 in enumerate(particles):
            if n>=m:
                continue
            intersects=check_if_intersect(particle1, particle2)
            total_answer+=intersects
    return total_answer

def part_2_method(input):
    lines=input.split("\n")
    particles=[line_to_particle(line) for line in lines]
    golden_line_position_velocity_and_modulus=bro_do_you_even_lift(particles)
    answer=sum(golden_line_position_velocity_and_modulus[0:3])
    # answer might be off if any of the coordinates are negative, like if if you get 1000 mod 1024 your answer is probably -24
    return answer

def line_to_particle(line):
    position, velocity=line.split(" @ ")
    position=[int(x) for x in position.split(", ")]
    velocity=[int(x) for x in velocity.split(", ")]
    return position, velocity

def trim_to_two_coord(particle):
    return [x[:2] for x in particle]

def check_if_intersect(particle_1, particle_2, boundary_min=200000000000000, boundary_max=400000000000000):
    p_1, v_1=particle_1
    p_2, v_2=particle_2
    a,c=v_1
    b,d= [-1*x for x in v_2]
    y=diff(p_2,p_1)
    determinant=a*d-b*c
    if determinant==0:
        return 0
    t_1=dot([d, -1*b], y)/determinant
    t_2=dot([-1*c, a], y)/determinant
    location=[x+t_1*v for x,v in zip(p_1, v_1)]
    if t_1<0:
        return False
    if t_2<0:
        return False
    if any(x<boundary_min for x in location):
        return False
    if any(x>boundary_max for x in location):
        return False
    return True

def dot(vec1, vec2):
    return sum(x*y for x,y in zip(vec1, vec2))

def diff(vec1, vec2):
    return [x-y for x,y in zip(vec1, vec2)]

def particle_at_time(particle, time):
    pos, vel=particle
    return [p+v*time for p, v in zip(pos, vel)]

def bro_do_you_even_lift(particles):
    # finds the golden line by lifting
    stop_cutoff=max([max(abs(x) for x in particle[0]) for particle in particles])
    initial_solution=[0,0,0,0,0,0,1]
    solutions=deque([initial_solution])
    modulus=0
    while modulus<10*stop_cutoff:
        solution=solutions.pop()
        if not is_valid(solution, particles):
            continue
        candidate_new_solutions=lifting_candidates(solution)
        solutions.extendleft(candidate_new_solutions)
        print(solution)
        modulus=solution[-1]
    return solution

def is_valid(potential_solution, particles):
    # checks if potential_solution intersects all particles, modulo modulus
    modulus=potential_solution[-1]
    golden_line=[potential_solution[0:3], potential_solution[3:6]]
    for particle in particles:
        if not find_intersection_times_modulo(golden_line, particle, modulus):
            return False
    return True

def lifting_candidates(solution):
    modulus=solution[6]
    non_scaled_expansion=[[a,b,c,d,e,f,1] for a in range(2) for b in range(2) for c in range(2) for d in range(2) for e in range(2) for f in range(2)]
    candidates=[[x+modulus*y for x,y in zip(solution, option)] for option in non_scaled_expansion] 
    return candidates

def find_intersection_times_modulo(particle_1, particle_2, modulus):
    if modulus==1:
        return [0]
    else:
        smaller_solutions=find_intersection_times_modulo(particle_1, particle_2, modulus//2)
        candidate_times=smaller_solutions+[x+modulus//2 for x in smaller_solutions]
        valid_times=[cand for cand in candidate_times if intersects_at_time_modulo(particle_1, particle_2, cand, modulus)]
        return valid_times
        
def intersects_at_time_modulo(particle_1, particle_2, time, modulus):
    # returns whether or not particle_1 and particle_2 intersect at the given time, modulo the modulus
    position_1=particle_at_time(particle_1, time)
    position_2=particle_at_time(particle_2, time)
    position_differences=diff(position_1,position_2)
    return all(x%modulus==0 for x in position_differences)


if __name__=="__main__":
    day=24

    # do_part(part_number=1, use_test=True, day=day)
    # do_part(part_number=1, use_test=False, day=day)
    do_part(part_number=2, use_test=True, day=day)
    do_part(part_number=2, use_test=False, day=day)
