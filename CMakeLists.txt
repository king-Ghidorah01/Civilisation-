cmake_minimum_required(VERSION 3.10)
project(CivilizationWasm)

set(CMAKE_CXX_STANDARD 17)

# Emscripten flags
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -O3 -lembind")
set(CMAKE_EXECUTABLE_SUFFIX ".js")

add_executable(industry_sim src/cpp/IndustrialSimulation.cpp)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s MODULARIZE=1 -s EXPORT_NAME=IndustrialSimModule")
