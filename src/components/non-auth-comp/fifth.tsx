"use client";

import Image from "next/image";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { landing } from "@/lib/text/landing";

const Fifth = () => {
  const data = landing; // REMOVED: testimonials array (Lines 17-57)

  return (
    <section className="py-16 bg-gray-50 font-['Lora'] overflow-hidden">
                 {" "}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Why Choose Section */}               {" "}
        <div className="mb-16">
                             {" "}
          <div className="relative rounded-2xl overflow-hidden bg-white/95 shadow-lg border border-gray-200">
                                    {/* Background image */}                   
               {" "}
            <div className="absolute inset-0 z-10">
                                         {" "}
              <Image
                src="/why_vakilfy.jpg"
                alt=""
                fill
                className="object-cover opacity-15"
                priority
              />
                                     {" "}
            </div>
                                   {" "}
            <div className="bg-[#0b2a3a] text-white px-6 sm:px-8 py-4 flex items-center justify-between">
                                         {" "}
              <h3 className="text-xl sm:text-2xl font-bold">
                {data.fifth.why.title}
              </h3>
                                     {" "}
            </div>
                                   {" "}
            <div className="px-6 sm:px-8 py-6">
                                         {" "}
              <p className="text-black mb-8 leading-relaxed font-['Lora'] text-xl">
                                                {data.fifth.why.intro}         
                                 {" "}
              </p>
                                         {" "}
              <ul className="space-y-5">
                                               {" "}
                <li className="flex items-start gap-4">
                                                     {" "}
                  <span className="mt-1 text-cyan-600" aria-hidden="true">
                                                           {" "}
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                                                                 {" "}
                      <path d="M20.285 6.709a1 1 0 0 1 .006 1.414l-9.193 9.25a1 1 0 0 1-1.42.01L3.71 12.31a1 1 0 1 1 1.414-1.414l5.147 5.147 8.486-8.53a1 1 0 0 1 1.528.195z" />
                                                             {" "}
                    </svg>
                                                       {" "}
                  </span>
                                                     {" "}
                  <span className="text-gray-800 text-lg">
                    {data.fifth.why.points[0]}
                  </span>
                                                 {" "}
                </li>
                                               {" "}
                <li className="flex items-start gap-4">
                                                     {" "}
                  <span className="mt-1 text-cyan-600" aria-hidden="true">
                                                           {" "}
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                                                                 {" "}
                      <path d="M20.285 6.709a1 1 0 0 1 .006 1.414l-9.193 9.25a1 1 0 0 1-1.42.01L3.71 12.31a1 1 0 1 1 1.414-1.414l5.147 5.147 8.486-8.53a1 1 0 0 1 1.528.195z" />
                                                             {" "}
                    </svg>
                                                       {" "}
                  </span>
                                                     {" "}
                  <span className="text-gray-800 text-lg">
                    {data.fifth.why.points[1]}
                  </span>
                                                 {" "}
                </li>
                                               {" "}
                <li className="flex items-start gap-4">
                                                     {" "}
                  <span className="mt-1 text-cyan-600" aria-hidden="true">
                                                           {" "}
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                                                                 {" "}
                      <path d="M20.285 6.709a1 1 0 0 1 .006 1.414l-9.193 9.25a1 1 0 0 1-1.42.01L3.71 12.31a1 1 0 1 1 1.414-1.414l5.147 5.147 8.486-8.53a1 1 0 0 1 1.528.195z" />
                                                             {" "}
                    </svg>
                                                       {" "}
                  </span>
                                                     {" "}
                  <span className="text-gray-800 text-lg">
                    {data.fifth.why.points[2]}
                  </span>
                                                 {" "}
                </li>
                                               {" "}
                <li className="flex items-start gap-4">
                                                     {" "}
                  <span className="mt-1 text-cyan-600" aria-hidden="true">
                                                           {" "}
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                                                                 {" "}
                      <path d="M20.285 6.709a1 1 0 0 1 .006 1.414l-9.193 9.25a1 1 0 0 1-1.42.01L3.71 12.31a1 1 0 1 1 1.414-1.414l5.147 5.147 8.486-8.53a1 1 0 0 1 1.528.195z" />
                                                             {" "}
                    </svg>
                                                       {" "}
                  </span>
                                                     {" "}
                  <span className="text-gray-800 text-lg">
                    {data.fifth.why.points[3]}
                  </span>
                                                 {" "}
                </li>
                                               {" "}
                <li className="flex items-start gap-4">
                                                     {" "}
                  <span className="mt-1 text-cyan-600" aria-hidden="true">
                                                           {" "}
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                                                                 {" "}
                      <path d="M20.285 6.709a1 1 0 0 1 .006 1.414l-9.193 9.25a1 1 0 0 1-1.42.01L3.71 12.31a1 1 0 1 1 1.414-1.414l5.147 5.147 8.486-8.53a1 1 0 0 1 1.528.195z" />
                                                             {" "}
                    </svg>
                                                       {" "}
                  </span>
                                                     {" "}
                  <span className="text-gray-800 text-lg">
                    {data.fifth.why.points[4]}
                  </span>
                                                 {" "}
                </li>
                                               {" "}
                <li className="flex items-start gap-4">
                                                     {" "}
                  <span className="mt-1 text-cyan-600" aria-hidden="true">
                                                           {" "}
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                                                                 {" "}
                      <path d="M20.285 6.709a1 1 0 0 1 .006 1.414l-9.193 9.25a1 1 0 0 1-1.42.01L3.71 12.31a1 1 0 1 1 1.414-1.414l5.147 5.147 8.486-8.53a1 1 0 0 1 1.528.195z" />
                                                             {" "}
                    </svg>
                                                       {" "}
                  </span>
                                                     {" "}
                  <span className="text-gray-800 text-lg">
                    {data.fifth.why.points[5]}
                  </span>
                                                 {" "}
                </li>
                                           {" "}
              </ul>
                                     {" "}
            </div>
                                     {/* Decorative bottom-right gradient */}
                                     
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-6 -right-6 w-64 h-64"
              style={{
                background:
                  "radial-gradient(ellipse 140px 140px at bottom right, rgba(11,42,58,0.18) 0%, rgba(11,42,58,0.10) 35%, rgba(11,42,58,0.05) 60%, transparent 80%)",
              }}
            />
                               {" "}
          </div>
                         {" "}
        </div>
                        {/* Who We Serve Section */}               {" "}
        <div className="mb-16">
                             {" "}
          <div className="relative rounded-2xl overflow-hidden bg-white/95 shadow-lg border border-gray-200">
                                    {/* Background image */}                   
               {" "}
            <div className="absolute inset-0 z-10">
                                         {" "}
              <Image
                src="/who_serve.jpg"
                alt=""
                fill
                className="object-cover opacity-15"
                priority
              />
                                     {" "}
            </div>
                                   {" "}
            <div className="bg-[#0b2a3a] text-white px-6 sm:px-8 py-4">
                                         {" "}
              <h3 className="text-xl sm:text-2xl font-bold">
                {data.fifth.whoServe.title}
              </h3>
                                     {" "}
            </div>
                                   {" "}
            <div className="px-6 sm:px-8 py-6">
                                         {" "}
              <p className="text-gray-800 mb-8 leading-relaxed font-['Lora'] text-xl">
                {data.fifth.whoServe.intro}
              </p>
                                         {" "}
              <div className="flex flex-col gap-6">
                                               {" "}
                <div className="flex items-start gap-3">
                                                     {" "}
                  <span className="mt-1 text-cyan-600" aria-hidden="true">
                                                           {" "}
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.285 6.709a1 1 0 0 1 .006 1.414l-9.193 9.25a1 1 0 0 1-1.42.01L3.71 12.31a1 1 0 1 1 1.414-1.414l5.147 5.147 8.486-8.53a1 1 0 0 1 1.528.195z" />
                    </svg>
                                                       {" "}
                  </span>
                                                     {" "}
                  <p className="text-gray-900 font-['Lora'] text-lg">
                    {data.fifth.whoServe.points[0]}
                  </p>
                                                 {" "}
                </div>
                                               {" "}
                <div className="flex items-start gap-3">
                                                     {" "}
                  <span className="mt-1 text-cyan-600" aria-hidden="true">
                                                           {" "}
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.285 6.709a1 1 0 0 1 .006 1.414l-9.193 9.25a1 1 0 0 1-1.42.01L3.71 12.31a1 1 0 1 1 1.414-1.414l5.147 5.147 8.486-8.53a1 1 0 0 1 1.528.195z" />
                    </svg>
                                                       {" "}
                  </span>
                                                     {" "}
                  <p className="text-gray-900 font-['Lora'] text-lg">
                    {data.fifth.whoServe.points[1]}
                  </p>
                                                 {" "}
                </div>
                                               {" "}
                <div className="flex items-start gap-3">
                                                     {" "}
                  <span className="mt-1 text-cyan-600" aria-hidden="true">
                                                           {" "}
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.285 6.709a1 1 0 0 1 .006 1.414l-9.193 9.25a1 1 0 0 1-1.42.01L3.71 12.31a1 1 0 1 1 1.414-1.414l5.147 5.147 8.486-8.53a1 1 0 0 1 1.528.195z" />
                    </svg>
                                                       {" "}
                  </span>
                                                     {" "}
                  <p className="text-gray-900 font-['Lora'] text-lg">
                    {data.fifth.whoServe.points[2]}
                  </p>
                                                 {" "}
                </div>
                                               {" "}
                <div className="flex items-start gap-3">
                                                     {" "}
                  <span className="mt-1 text-cyan-600" aria-hidden="true">
                                                           {" "}
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.285 6.709a1 1 0 0 1 .006 1.414l-9.193 9.25a1 1 0 0 1-1.42.01L3.71 12.31a1 1 0 1 1 1.414-1.414l5.147 5.147 8.486-8.53a1 1 0 0 1 1.528.195z" />
                    </svg>
                                                       {" "}
                  </span>
                                                     {" "}
                  <p className="text-gray-900 font-['Lora'] text-lg">
                    {data.fifth.whoServe.points[3]}
                  </p>
                                                 {" "}
                </div>
                                           {" "}
              </div>
                                     {" "}
            </div>
                               {" "}
          </div>
                         {" "}
        </div>
                       {" "}
        {/* REMOVED: Header Section (Lines 189-209 in your original file) */}   
                   {" "}
        {/* REMOVED: Continuous Scrolling Testimonials (Lines 212-300 in your original file) */}
                       {" "}
        {/* REMOVED: Bottom Section (Lines 302-316 in your original file) */}   
               {" "}
      </div>
                 {" "}
      {/* REMOVED: <style jsx> block (Lines 318-333 in your original file) */} 
           {" "}
    </section>
  );
};

export default Fifth;
