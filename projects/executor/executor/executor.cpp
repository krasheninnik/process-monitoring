#include "executor.hpp"
#include <ppltasks.h>

Executor::Executor(std::unique_ptr<cpp_redis::client> redisClient, int maxConcurrency, std::string alarmChannel):
	redisClient(std::move(redisClient)), maxConcurrency(maxConcurrency), alarmChannel(alarmChannel) {
};

void Executor::processFile(std::string filename) {
	std::cout << "start processing file(" << currentConcurrency << "): " << filename << std::endl;

	// realy, there need check JSON parser... )0)
	// until it just 10 second sleep
	using namespace std::chrono_literals;
	std::this_thread::sleep_for(10000ms);

	std::cout << "end processing filename: " << filename << std::endl;
	currentConcurrency--;

	// notify client that processing has been end,
	// for the case if in the filenamequeue still exist files
	redisClient->publish(alarmChannel, "file processing has been end");
	redisClient->commit();
}

void Executor::processTask() {
	if (currentConcurrency == maxConcurrency) {
		std::cout << "postpone processing: current concurrecny is maximum" << std::endl;
		return;
	}
	currentConcurrency++;
	std::cout << "attempt to get filename from query " << filenamequeue << std::endl;
	redisClient->rpop(filenamequeue, [this](const cpp_redis::reply reply) {
		std::cout << "get filename: " << reply << std::endl;
		if (reply.is_string()) {
			if (reply.as_string() != "(nil)");
			// start task execution in parallel:
			std::thread t([this, reply]() {this->processFile(reply.as_string()); });
			t.detach();				
		};
	});
	redisClient->commit();
}