// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use log::info;
use env_logger::Env;

fn main() {
  env_logger::Builder::from_env(Env::default().default_filter_or("debug")).init();
  info!("Starting application");
  app_lib::run();
}
