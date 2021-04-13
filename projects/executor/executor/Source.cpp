#include <cpp_redis/cpp_redis>
#include <tacopie/tacopie>
#include "executor.hpp"

#include <condition_variable>
#include <iostream>
#include <mutex>
#include <signal.h>
#include <memory>

#ifdef _WIN32
#include <Winsock2.h>
#endif /* _WIN32 */

const std::string ALARM_CHANNEL_NAME = "alarmchannel";
const int MAX_CONCURRENCY = 4;

std::condition_variable should_exit;

void sigint_handler(int) { should_exit.notify_all();}

int main(void) {
#ifdef _WIN32
    //! Windows netword DLL init
    WORD version = MAKEWORD(2, 2);
    WSADATA data;

    if (WSAStartup(version, &data) != 0) {
        std::cerr << "WSAStartup() failure" << std::endl;
        return -1;
    }
#endif /* _WIN32 */
    //! Enable logging
    cpp_redis::active_logger = std::unique_ptr<cpp_redis::logger>(new cpp_redis::logger);

    // create client
    auto clientPtr = std::make_unique<cpp_redis::client>();
    //cpp_redis::client client;
    std::cout << "attempt to connect client to Redis" << std::endl;
    clientPtr->connect("127.0.0.1", 6379, [](const std::string& host, std::size_t port, cpp_redis::client::connect_state status) {
        if (status == cpp_redis::client::connect_state::dropped) {
            std::cout << "client disconnected from " << host << ":" << port << std::endl;
        }
        });
    std::cout << "client connected to Redis" << std::endl;

    /*
    clientPtr->flushall([](const cpp_redis::reply reply) {
        std::cout << "client FLUSHALL: " << reply << std::endl;
        });
    clientPtr->commit();
    */

    cpp_redis::subscriber sub;
    std::cout << "attempt to connect subscriber to Redis" << std::endl;
    sub.connect("127.0.0.1", 6379, [](const std::string& host, std::size_t port, cpp_redis::subscriber::connect_state status) {
        if (status == cpp_redis::subscriber::connect_state::dropped) {
            std::cout << "client disconnected from " << host << ":" << port << std::endl;
            should_exit.notify_all();
        }
        });

    std::cout << "subscriber connected to Redis" << std::endl;

     Executor executor(std::move(clientPtr), MAX_CONCURRENCY, ALARM_CHANNEL_NAME);

    std::cout << "subscribe channel " << ALARM_CHANNEL_NAME << std::endl;
    sub.subscribe(ALARM_CHANNEL_NAME, [&executor](const std::string& chan, const std::string& msg) {
        std::cout << "Message from channel: " << msg << std::endl;
        executor.processTask();
    });

    sub.commit();

    signal(SIGINT, &sigint_handler);
    std::mutex mtx;
    std::unique_lock<std::mutex> l(mtx);
    should_exit.wait(l);

#ifdef _WIN32
    WSACleanup();
#endif /* _WIN32 */

    return 0;
}