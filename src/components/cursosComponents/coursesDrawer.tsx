/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// components/cursosComponents/coursesDrawer.tsx
'use client';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { X, Plus, Check, Trash } from 'lucide-react';
import { useColorContext } from '~/lib/colorContext';
import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog';

interface Course {
  id: number;
  title: string;
  description: string;
}

interface CoursesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onFormSubmit: () => void;
  pathId: number;
  course: Course | null;
}

export function CoursesDrawer({ isOpen, onClose, onFormSubmit, pathId, course }: CoursesDrawerProps) {
  const { activeColorSet } = useColorContext();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [nonLinkedCourses, setNonLinkedCourses] = useState<Course[]>([]);
  const [linkedCourses, setLinkedCourses] = useState<Course[]>([]);
  const [selectedNonLinkedCourses, setSelectedNonLinkedCourses] = useState<number[]>([]);
  const [selectedLinkedCourses, setSelectedLinkedCourses] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Reset form and fetch data when drawer opens or course changes
  useEffect(() => {
    if (isOpen) {
      if (course) {
        setFormData({
          title: course.title,
          description: course.description,
        });
      } else {
        setFormData({
          title: '',
          description: '',
        });
      }
      void fetchCourses();
    }
  }, [isOpen, course]);

  // Fetch courses
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const allCoursesResponse = await fetch('/cursos/api/courses');
      if (!allCoursesResponse.ok) throw new Error('Failed to fetch all courses');
      const allCourses = await allCoursesResponse.json();

      const linkedCoursesResponse = await fetch(`/cursos/api/courses/by-path/${pathId}`);
      if (!linkedCoursesResponse.ok) throw new Error('Failed to fetch linked courses');
      const linkedCourses = await linkedCoursesResponse.json();

      const nonLinkedCourses = allCourses.filter(
        (course: Course) => !linkedCourses.some((linkedCourse: Course) => linkedCourse.id === course.id)
      );

      setNonLinkedCourses(nonLinkedCourses);
      setLinkedCourses(linkedCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission for creating/updating a course
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (course) {
        // Update existing course
        const response = await fetch(`/cursos/api/courses/${course.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Failed to update course');
        }
      } else {
        // Create new course
        const response = await fetch(`/cursos/api/courses/by-path/${pathId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Failed to create course');
        }
      }

      onFormSubmit();
      onClose();
    } catch (error) {
      console.error('Error saving course:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle course deletion
  const handleDeleteCourse = async () => {
    if (!course?.id) return;

    try {
      const response = await fetch(`/cursos/api/courses/${course.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }

      onFormSubmit();
      onClose();
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  // Handle linking selected courses
  const handleLinkCourses = async () => {
    try {
      const response = await fetch(`/cursos/api/courses/link/${pathId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseIds: selectedNonLinkedCourses }),
      });

      if (!response.ok) {
        throw new Error('Failed to link courses');
      }

      await fetchCourses();
      setSelectedNonLinkedCourses([]);
      onFormSubmit();
    } catch (error) {
      console.error('Error linking courses:', error);
    }
  };

  // Handle unlinking selected courses
  const handleUnlinkCourses = async () => {
    try {
      const response = await fetch(`/cursos/api/courses/unlink/${pathId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseIds: selectedLinkedCourses }),
      });

      if (!response.ok) {
        throw new Error('Failed to unlink courses');
      }

      await fetchCourses();
      setSelectedLinkedCourses([]);
      onFormSubmit();
    } catch (error) {
      console.error('Error unlinking courses:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div
        className={`fixed right-0 top-0 h-full w-[600px] ${activeColorSet.bg} text-white backdrop-blur-md rounded-l-xl bg-opacity-10 z-50
          shadow-lg transform transition-transform duration-300 ease-in-out overflow-y-auto
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-7 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">
              {course ? 'Edit Course' : 'Add Course'}
            </h2>
            <div className="flex gap-2">
              {course && (
                <button
                  onClick={() => setShowDeleteDialog(true)}
                  className="p-2 hover:bg-red-700/50 transition-all rounded-full text-red-500"
                >
                  <Trash className="h-5 w-5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700 transition-all rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : (
            <div className="space-y-6 flex-1 p-9 overflow-auto mb-[70px] border border-gray-700 rounded-md">
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-md font-semibold">
                  {course ? 'Update Course' : 'Create New Course'}
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Course title"
                    className="w-full bg-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Course description"
                    className="w-full bg-transparent"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="submit" className={`w-full ${activeColorSet.bgButton} ${activeColorSet.bgButtonHover}`}>
                    {course ? 'Update Course' : 'Create Course'}
                  </Button>
                </div>
              </form>

              {!course && (
                <>
                  {/* List of non-linked courses */}
                  <div className="space-y-4 mt-8">
                    <h3 className="text-md font-semibold">Available Courses</h3>
                    {nonLinkedCourses.map((course) => (
                      <div
                        key={course.id}
                        className={`p-4 border rounded-lg cursor-pointer ${
                          selectedNonLinkedCourses.includes(course.id)
                            ? `${activeColorSet.borderButton} bg-opacity-20`
                            : 'border-white/10'
                        }`}
                        // onClick={() => handleSelectNonLinkedCourse(course.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-lg">{course.title}</h4>
                            <p className="text-sm text-white/70">{course.description}</p>
                          </div>
                          {selectedNonLinkedCourses.includes(course.id) && (
                            <Check className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                      </div>
                    ))}
                    <Button
                      onClick={handleLinkCourses}
                      className={`w-full ${activeColorSet.bgButton} ${activeColorSet.bgButtonHover}`}
                      disabled={selectedNonLinkedCourses.length === 0}
                    >
                      Link Selected Courses
                    </Button>
                  </div>

                  {/* List of linked courses */}
                  <div className="space-y-4 mt-8">
                    <h3 className="text-md font-semibold">Linked Courses</h3>
                    {linkedCourses.map((course) => (
                      <div
                        key={course.id}
                        className={`p-4 border rounded-lg cursor-pointer ${
                          selectedLinkedCourses.includes(course.id)
                            ? `${activeColorSet.borderButton} bg-opacity-20`
                            : 'border-white/10'
                        }`}
                        // onClick={() => handleSelectLinkedCourse(course.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-lg">{course.title}</h4>
                            <p className="text-sm text-white/70">{course.description}</p>
                          </div>
                          {selectedLinkedCourses.includes(course.id) && (
                            <Check className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                      </div>
                    ))}
                    <Button
                      onClick={handleUnlinkCourses}
                      className={`w-full ${activeColorSet.bgButton} ${activeColorSet.bgButtonHover}`}
                      disabled={selectedLinkedCourses.length === 0}
                    >
                      Unlink Selected Courses
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this course.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCourse}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}