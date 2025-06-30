'use client'

import { motion } from 'framer-motion'
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Instagram,
  Mail,
  MapPin,
  Calendar,
  Code,
  Smartphone,
  Database,
  Cloud
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

export default function AboutPage() {
  const skills = [
    { icon: Code, name: 'Java', level: 'Advanced' },
    { icon: Code, name: 'Flutter', level: 'Advanced' },
    { icon: Code, name: 'Python', level: 'Advanced' },
    { icon: Smartphone, name: 'Mobile Development', level: 'Advanced' },
    { icon: Database, name: 'TensorFlow', level: 'Learning' },
    { icon: Database, name: 'Pandas', level: 'Learning' },
    { icon: Cloud, name: 'Machine Learning', level: 'Intermediate' },
    { icon: Database, name: 'Maths and Stats', level: 'Advanced' },
  ]

  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/sanketp1',
      icon: Github,
      color: 'hover:text-gray-900'
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/psanket18/',
      icon: Linkedin,
      color: 'hover:text-blue-600'
    },
    {
      name: 'Twitter',
      url: 'https://x.com/p_sanket18',
      icon: Twitter,
      color: 'hover:text-blue-400'
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/p.sanket18/',
      icon: Instagram,
      color: 'hover:text-pink-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Badge variant="secondary" className="mb-6">
              About Me
            </Badge>
            
            {/* Profile Picture */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="relative w-48 h-48 mx-auto mb-6">
                <Image
                  src="https://fmzqhgyfpkifsbymzdoy.supabase.co/storage/v1/object/public/portfolio/profile/IMG_20241221_185252.jpg"
                  alt="Sanket Patil"
                  fill
                  className="rounded-full object-cover shadow-2xl border-4 border-white"
                  priority
                />
              </div>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Sanket Patil
              <span className="text-primary block text-2xl sm:text-3xl lg:text-4xl font-normal mt-2">
                Full Stack Developer
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Converting thought to reality through innovative software solutions. 
              Passionate about mobile app development, machine learning, and creating 
              exceptional user experiences.
            </p>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex justify-center space-x-6 mb-8"
            >
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ${social.color}`}
                >
                  <social.icon className="h-6 w-6" />
                </a>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Me Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                About Me
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  I'm a passionate developer based in Maharashtra, India. 
                  My journey in software development has been driven by curiosity and a desire to create 
                  meaningful solutions that make a difference.
                </p>
                <p>
                  I specialize in Java development, Flutter mobile development and Python programming, with a growing 
                  interest in machine learning and data science. Currently, I'm expanding my skills 
                  in TensorFlow and Pandas to build intelligent applications.
                </p>
                <p>
                  I love collaborating on mobile app projects and machine learning initiatives. 
                  When I'm not coding, you can find me exploring new technologies, contributing to 
                  open-source projects, or sharing knowledge with the developer community.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Info</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span className="text-gray-600">Maharashtra, India</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Code className="h-5 w-5 text-primary" />
                      <span className="text-gray-600">Full Stack Developer</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span className="text-gray-600">Available for collaborations</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <span className="text-gray-600">Let's connect!</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Skills & Technologies
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Here are the technologies and skills I work with to bring ideas to life.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <skill.icon className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {skill.name}
                    </h3>
                    <Badge variant="secondary" className="text-sm">
                      {skill.level}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Focus Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              What I'm Working On
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl p-8">
                <Code className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Flutter Development
                </h3>
                <p className="text-gray-600">
                  Building cross-platform mobile applications with modern UI/UX design patterns.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-2xl p-8">
                <Database className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Machine Learning
                </h3>
                <p className="text-gray-600">
                  Learning TensorFlow and Pandas to develop intelligent applications and data analysis.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-2xl p-8">
                <Cloud className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Open Source
                </h3>
                <p className="text-gray-600">
                  Contributing to open-source projects and collaborating with the developer community.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Let's Connect!
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              I'm always open to discussing new opportunities, collaborations, or just having a chat about technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/sanketp1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Github className="h-5 w-5 mr-2" />
                View My Work
              </a>
              <a
                href="https://www.linkedin.com/in/psanket18/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5 mr-2" />
                Connect on LinkedIn
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
} 