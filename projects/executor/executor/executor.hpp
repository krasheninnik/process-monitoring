#pragma once
#include <cpp_redis/cpp_redis>
#include <future>
#include <fstream>
#include <atomic>

class Executor {
public:
	Executor(std::unique_ptr<cpp_redis::client> redisClient, int maxConcurrency, std::string alarmChannel);
	void processTask(); 

private:
	void processFile(std::string filename); 
	std::unique_ptr<cpp_redis::client> redisClient;
	int maxConcurrency;
	std::atomic<int> currentConcurrency = 0;
	std::string filenamequeue = "filenamequeue";
	std::string alarmChannel;
};

